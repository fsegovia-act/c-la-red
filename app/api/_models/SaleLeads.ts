import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
export interface ISaleLead extends Document {
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const SaleLeadSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const SaleLead =
  mongoose.models.SaleLead ||
  mongoose.model<ISaleLead>("SaleLead", SaleLeadSchema);

export default SaleLead;
