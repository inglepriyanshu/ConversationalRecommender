import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conneStr } from '@/app/utils/db';
import { productModel } from '@/app/utils/productModel';

await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(req,{params}) {  

  const { p_id } = await params;
  console.log(p_id);
  

  try {
    const product = await productModel.find({ product_id: p_id });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    NextResponse.json({ message: 'Server error' });
  }
}
