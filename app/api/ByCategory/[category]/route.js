import { conneStr } from "@/app/utils/db";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose"; 
import { NextResponse } from "next/server";


await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(req, {params}){
    try {        
        let { category } = await params;
        console.log(category);
        

        const products = await productModel.find({category}).limit(20)

        return NextResponse.json({
            success:true,
            products
        })
    } catch (error) {
        console.log("Error:",error);
        return NextResponse.json({
            success:false,
            message:"Error fetching Category-wise products"
        })
    }
}