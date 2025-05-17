import jwt from "jsonwebtoken";
import { IUser } from "../_models/Users";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const generateToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
