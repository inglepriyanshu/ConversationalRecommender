import { conneStr } from "@/app/utils/db";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";





await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(){
    try {
        const data = await productModel.find().limit(13)

        return NextResponse.json({result:true, data})
    } catch (error) {
        console.log("Error:", error)
        return NextResponse.json({message: "Some err while fetching products"})
    }
}