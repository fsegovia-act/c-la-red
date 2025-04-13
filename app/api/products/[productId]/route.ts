// app/api/products/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../_lib/mongodb';
import Product from '../../_models/Products';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  await dbConnect();
  const { productId } = await params;
  
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching product' },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  await dbConnect();
  const productId = params.productId;
  
  try {
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error updating product' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  await dbConnect();
  const productId = params.productId;
  
  try {
    const deletedProduct = await Product.deleteOne({ _id: productId });
    
    if (!deletedProduct.deletedCount) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error deleting product' },
      { status: 400 }
    );
  }
}