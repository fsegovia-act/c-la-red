// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_lib/mongodb';
import Product from '../_models/Products';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  
  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching product' },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  
  try {
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, {
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
    console.error('PUT product error:', error);
    return NextResponse.json(
      { success: false, error: 'Error updating product' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  
  try {
    const deletedProduct = await Product.deleteOne({ _id: id });
    
    if (!deletedProduct.deletedCount) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json(
      { success: false, error: 'Error deleting product' },
      { status: 400 }
    );
  }
}