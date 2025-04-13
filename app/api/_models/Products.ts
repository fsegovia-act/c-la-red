// models/Product.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import dbConnect from "../_lib/mongodb";

// Define the TypeScript interface for a product
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the MongoDB schema for a product
const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    sku: {
      type: String,
      required: [true, "Please provide a SKU"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: "/images/default-product.jpg",
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Add indexes for better query performance
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1 });
// ProductSchema.index({ sku: 1 });

// Add a virtual field for discounted price (example of virtual field)
ProductSchema.virtual("discountedPrice").get(function (this: IProduct) {
  return this.price * 0.9; // 10% discount as an example
});

// Add a pre-save hook to check inventory and mark availability
ProductSchema.pre("save", function (this: IProduct, next) {
  if (this.stockQuantity <= 0) {
    this.isAvailable = false;
  }
  next();
});

// Create or get the Product model
let Product: Model<IProduct>;

try {
  // Check if the model already exists to prevent model overwrite error
  Product = mongoose.model<IProduct>("Product");
} catch {
  // If model doesn't exist, create a new one
  Product = mongoose.model<IProduct>("Product", ProductSchema);
}

export default Product;

// Helper function to ensure MongoDB connection before using the model
export async function getProductModel(): Promise<Model<IProduct>> {
  await dbConnect();
  return Product;
}

// Example usage functions for CRUD operations
export async function createProduct(
  productData: Partial<IProduct>
): Promise<IProduct> {
  const model = await getProductModel();
  return model.create(productData);
}

export async function getProducts(limit = 10, page = 1): Promise<IProduct[]> {
  const model = await getProductModel();
  const skip = (page - 1) * limit;
  return model.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export async function getProductById(id: string): Promise<IProduct | null> {
  const model = await getProductModel();
  return model.findById(id);
}

export async function updateProduct(
  id: string,
  updates: Partial<IProduct>
): Promise<IProduct | null> {
  const model = await getProductModel();
  return model.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
}

export async function deleteProduct(id: string): Promise<IProduct | null> {
  const model = await getProductModel();
  return model.findByIdAndDelete(id);
}

export async function searchProducts(query: string): Promise<IProduct[]> {
  const model = await getProductModel();
  return model
    .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } });
}
