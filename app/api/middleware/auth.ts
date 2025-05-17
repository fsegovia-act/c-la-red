import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../_lib/customClasses";
import jwt from "jsonwebtoken";
import { User, IUser } from "../_models/Users";
import { UserRole } from "../_lib/interfaces";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const generateToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

// Middleware to protect routes
export const isAuthenticated = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new HttpError("Not authenticated. No token provided", 401);

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user)
      throw new HttpError(
        "User belonging to this token no longer exists.",
        401
      );

    if (user.isActive === false)
      throw new HttpError("User is no longer active", 401);

    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat))
      throw new HttpError(
        "User recently changed password. Please log in again.",
        401
      );

    const requestWithUser = new NextRequest(req.url, {
      headers: req.headers,
      method: req.method,
    });

    Object.defineProperty(requestWithUser, "user", {
      value: user,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    Object.assign(req, { user });

    return;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
};

// Middleware to restrict access by role
export const restrictTo = (...roles: UserRole[]) => {
  return (req: NextRequest) => {
    if (!req.user) throw new HttpError("Not authenticated", 401);

    if (!roles.includes(req.user.role as UserRole))
      throw new HttpError("Not authorized to access this resource", 403);

    return;
  };
};
