import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../_lib/customClasses";
import validator from "validator";
import dbConnect from "../_lib/mongodb";
import { SaleLead } from "../_models/SaleLeads";
import { getPaginationParams } from "../_helpers/pagination";
import { ADMIN, SUPER_ADMIN, CreateSaleLeadInput } from "../_lib/interfaces";
import { withProtection } from "../middleware/wrapper";

const getSaleLeadList = async (req: NextRequest) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.url);

    const { searchParams } = new URL(req.url);
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const isActive = searchParams.get("isActive") || undefined;

    const query: Record<string, any> = {};
    if (isActive !== undefined) query.isActive = isActive === "true";

    await dbConnect();

    const [admins, total] = await Promise.all([
      SaleLead.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      SaleLead.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        pagination: {
          pages: Math.ceil(total / limit),
          page,
          limit,
          total: total,
        },
        data: admins,
      },
      { status: 200 }
    );
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 500 }
    );
  }
};

const createSaleLead = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) throw new HttpError("Please provide all required fields", 400);

    // valiation fields
    if (!validator.isEmail(email))
      throw new HttpError("Please provide a valid email", 400);

    await dbConnect();

    const existingSaleLead = await SaleLead.findOne({ email: email });
    if (existingSaleLead) {
      return NextResponse.json(
        {
          success: true,
          data: existingSaleLead,
        },
        { status: 200 }
      );
    }

    const saleLeadData: CreateSaleLeadInput = {
      ...body,
    };

    const newSaleLead = SaleLead.create(saleLeadData);

    return NextResponse.json(
      {
        success: true,
        data: newSaleLead,
      },
      { status: 200 }
    );
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 500 }
    );
  }
};

export const GET = withProtection(
  async (req: NextRequest) => {
    return getSaleLeadList(req);
  },
  [ADMIN, SUPER_ADMIN]
);

export const POST = withProtection(
  async (req: NextRequest) => {
    return createSaleLead(req);
  },
  [ADMIN, SUPER_ADMIN]
);
