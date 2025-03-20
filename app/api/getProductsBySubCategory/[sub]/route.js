import { conneStr } from "@/app/utils/db";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(req, { params }) {
    try {
        const { sub } = await params; 
        console.log(sub);
        
        const data = await productModel.aggregate([
            { $match: { sub_category:sub } },
            { $sample: { size: 14 } }
        ])
        console.log(data);

        return NextResponse.json({ result: true, data })
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ result: false, message: "Error fetching products" });
    }
}