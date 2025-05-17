import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../../_lib/customClasses";
import dbConnect from "../../_lib/mongodb";
import { User } from "../../_models/Users";
import { generateToken } from "../../middleware/auth";
import { ADMIN, SUPER_ADMIN } from "../../_lib/interfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password)
      throw new HttpError("Please provide email and password", 400);

    await dbConnect();

    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!user) throw new HttpError("Invalid credentials", 401);

    if (![ADMIN, SUPER_ADMIN].includes(user.role))
      throw new HttpError("Access denied. Not an administrator", 400);

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw new HttpError("Invalid credentials", 401);

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        success: true,
        message: "Sign in successful",
        data: {
          user: userObj,
          token,
        },
      },
      { status: 200 }
    );
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 500 }
    );
  }
}
