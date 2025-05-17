import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../_lib/interfaces";
import { HttpError } from "../_lib/customClasses";
import { isAuthenticated, restrictTo } from "./authMiddleware";

export const withProtection = (
  handler: (req: NextRequest, params: any) => Promise<NextResponse>,
  roles: UserRole[] = []
) => {
  return async (req: NextRequest, params: any) => {
    try {
      await isAuthenticated(req);

      if (roles.length > 0) await restrictTo(...roles)(req);

      return handler(req, params);
    } catch (error: HttpError | any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status || 500 }
      );
    }
  };
};
