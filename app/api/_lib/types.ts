import { IUser } from "../_models/Users";

declare module "next/server" {
  interface NextRequest {
    user?: IUser;
  }
}
