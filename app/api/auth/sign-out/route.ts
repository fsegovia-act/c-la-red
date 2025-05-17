import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../../_lib/customClasses";
import dbConnect from "../../_lib/mongodb";
import { User } from "../../_models/Users";
import { withProtection } from "../../middleware/wrapper";
import { ADMIN, SUPER_ADMIN } from "../../_lib/interfaces";

const signOut = async (req: NextRequest) => {
  try {
    const userId = req.user?.id;

    // If somehow there's no user (shouldn't happen with withProtection), still return success
    if (!userId) {
      return NextResponse.json(
        {
          success: true,
          message: "Sign out successful",
        },
        { status: 200 }
      );
    }

    await dbConnect();
    await User.findByIdAndUpdate(userId, {
      lastLogoutAt: new Date(),
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Sign out successful",
      },
      { status: 200 }
    );

    response.cookies.delete("token");
    response.cookies.delete("refresh_token");
    response.cookies.set({
      name: "logged_in",
      value: "false",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 500 }
    );
  }
};

export const POST = withProtection(
  async (req: NextRequest) => {
    return signOut(req);
  },
  [ADMIN, SUPER_ADMIN]
);
