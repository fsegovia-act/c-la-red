import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../_lib/customClasses";
import validator from "validator";
import dbConnect from "../_lib/mongodb";
import { User } from "../_models/Users";
import { getPaginationParams } from "../_helpers/pagination";
import { ADMIN, SUPER_ADMIN, CreateUserInput } from "../_lib/interfaces";
import { withProtection } from "../middleware/wrapper";

const getUserList = async (req: NextRequest) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.url);

    const { searchParams } = new URL(req.url);
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const searchTerm = searchParams.get("search") || undefined;
    const isActive = searchParams.get("isActive") || undefined;
    const role = searchParams.get("role") || undefined;

    const query: Record<string, any> = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (role) query.role = role;
    if (searchTerm) {
      query.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }
    const adminQuery = {
      ...query,
      role: { $in: [ADMIN, SUPER_ADMIN] },
    };

    await dbConnect();

    const [admins, total] = await Promise.all([
      User.find(adminQuery)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      User.countDocuments(adminQuery),
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

const createUser = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      profileImageUrl,
      role = ADMIN,
    } = body;

    if (!firstName || !lastName || !email || !password || !phoneNumber)
      throw new HttpError("Please provide all required fields", 400);

    // valiation fields
    if (!validator.isAlpha(firstName))
      throw new HttpError("Please provide a valid first name", 400);
    if (!validator.isAlpha(lastName))
      throw new HttpError("Please provide a valid last name", 400);
    if (!validator.isEmail(email))
      throw new HttpError("Please provide a valid email", 400);
    if (!validator.isStrongPassword(password))
      throw new HttpError("Please provide a strong password", 400);
    if (!validator.isMobilePhone(phoneNumber, "any"))
      throw new HttpError("Please provide a valid phone number", 400);
    if (profileImageUrl && !validator.isURL(profileImageUrl))
      throw new HttpError("Please provide a valid URL for profile image", 400);
    if (role !== ADMIN && role !== SUPER_ADMIN)
      throw new HttpError("Please provide a valid role", 400);

    await dbConnect();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new HttpError("Email already in use", 400);

    const adminData: CreateUserInput = {
      ...body,
    };

    const newAdmin = User.create(adminData);

    return NextResponse.json(
      {
        success: true,
        data: newAdmin,
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
    return getUserList(req);
  },
  [ADMIN, SUPER_ADMIN]
);

export const POST = withProtection(
  async (req: NextRequest) => {
    return createUser(req);
  },
  [ADMIN, SUPER_ADMIN]
);
