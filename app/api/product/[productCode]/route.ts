import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../_lib/mongodb";
import Product from "../../_models/Products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productCode: string }> }
) {
  await dbConnect();
  const { productCode } = await params;

  try {
    const product = await Product.findOne({ sku: productCode });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error fetching product" },
      { status: 400 }
    );
  }
}
