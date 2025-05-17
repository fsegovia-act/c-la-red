import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../../_lib/customClasses";
import validator from "validator";
import dbConnect from "../../_lib/mongodb";
import User from "../../_models/Users";
import { ADMIN, SUPER_ADMIN, UpdateUserInput } from "../../_lib/interfaces";
import { withProtection } from "../../middleware/wrapper";

const getUserDetails = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await params;

    if (!userId) throw new HttpError("User ID is required", 400);

    if (!validator.isMongoId(userId))
      throw new HttpError("Invalid user ID", 400);

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) throw new HttpError("User not found", 404);

    // If user is not super admin and trying to access other admin's details
    if (req.user?.role !== SUPER_ADMIN && req.user?.id.toString() !== userId) {
      throw new HttpError("You are not authorized to view this admin", 403);
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
};

const updateUser = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      profileImageUrl,
      role = ADMIN,
      isActive,
    } = body;

    const { userId } = await params;
    if (!userId) throw new HttpError("User ID is required", 400);
    if (!firstName || !lastName || !email || !phoneNumber)
      throw new HttpError("Please provide all required fields", 400);

    // valiation fields
    if (!validator.isMongoId(userId))
      throw new HttpError("Invalid user ID", 400);
    if (!validator.isAlpha(firstName))
      throw new HttpError("Please provide a valid first name", 400);
    if (!validator.isAlpha(lastName))
      throw new HttpError("Please provide a valid last name", 400);
    if (!validator.isEmail(email))
      throw new HttpError("Please provide a valid email", 400);
    if (!validator.isMobilePhone(phoneNumber, "any"))
      throw new HttpError("Please provide a valid phone number", 400);
    if (profileImageUrl && !validator.isURL(profileImageUrl))
      throw new HttpError("Please provide a valid URL for profile image", 400);
    if (role !== ADMIN && role !== SUPER_ADMIN)
      throw new HttpError("Please provide a valid role", 400);
    if (isActive !== undefined && typeof isActive !== "boolean")
      throw new HttpError("Please provide a valid isActive value", 400);

    await dbConnect();

    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== userId)
      throw new HttpError("Email already in use", 400);

    const updateData: UpdateUserInput = {
      firstName,
      lastName,
      email,
      phoneNumber,
      profileImageUrl,
      role,
      isActive,
    };

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, role: { $in: [ADMIN, SUPER_ADMIN] } },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) throw new HttpError("Failed to update user", 500);

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
};

const deleteUser = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await params;

    if (!userId) throw new HttpError("User ID is required", 400);

    if (!validator.isMongoId(userId))
      throw new HttpError("Invalid user ID", 400);

    // Check if the user is a super admin or the user themselves
    if (
      req.user?.role !== SUPER_ADMIN &&
      req.user?.id.toString() !== userId
    ) {
      throw new HttpError("You are not authorized to delete this user", 403);
    }

    // Check if user is trying to delete themselves
    if (req.user?.id.toString() === userId)
      throw new HttpError("You cannot delete your own account", 400);

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) throw new HttpError("User not found", 404);

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) throw new HttpError("User not found", 404);

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: HttpError | any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
};

export const GET = withProtection(
  async (req: NextRequest, params: { params: Promise<{ userId: string }> }) => {
    return getUserDetails(req, params);
  },
  [ADMIN, SUPER_ADMIN]
);

export const PUT = withProtection(
  async (req: NextRequest, params: { params: Promise<{ userId: string }> }) => {
    return updateUser(req, params);
  },
  [ADMIN, SUPER_ADMIN]
);

export const DELETE = withProtection(
  async (req: NextRequest, params: { params: Promise<{ userId: string }> }) => {
    return deleteUser(req, params);
  },
  [ADMIN, SUPER_ADMIN]
);
