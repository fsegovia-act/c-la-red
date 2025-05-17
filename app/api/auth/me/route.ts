import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../../_lib/customClasses";
import dbConnect from "../../_lib/mongodb";
import { User } from "../../_models/Users";
import { withProtection } from "../../middleware/wrapper";
import { ADMIN, SUPER_ADMIN } from "../../_lib/interfaces";
import { verifyToken } from "../../_helpers/tokens";

const me = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new HttpError("Unauthorized", 401);

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    await dbConnect();

    const user = await User.findById(decoded.userId);

    if (!user) throw new HttpError("User not found", 404);

    return NextResponse.json(
      {
        success: true,
        data: user,
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
    return me(req);
  },
  [ADMIN, SUPER_ADMIN]
);
