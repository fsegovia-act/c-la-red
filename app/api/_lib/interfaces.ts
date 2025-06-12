export const UserRole = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export const { ADMIN, SUPER_ADMIN } = UserRole;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profileImageUrl?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface CreateSaleLeadInput {
  email: string;
}
