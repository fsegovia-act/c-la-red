import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_lib/mongodb';
import Product from '../_models/Products';

export async function GET() {
  await dbConnect();
  
  try {
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching products' },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error creating product' },
      { status: 400 }
    );
  }
}