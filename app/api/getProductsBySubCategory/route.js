import { conneStr } from "@/app/utils/db";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(req) {
    try {
        const subCategory = req.nextUrl.searchParams.get('sub');
        
        const products = await productModel.find({ subCategory });
        
        return NextResponse.json({ result: true, data: products });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ result: false, message: "Error fetching products" });
    }
}
