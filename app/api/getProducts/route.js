import { conneStr } from "@/app/utils/db";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(){
    try {
        // Define category order
        const categoryOrder = ["Shoes", "Clothing", "Electronics"];
        
        // Get 6 random products from each category
        const promises = categoryOrder.map(category => 
            productModel.aggregate([
                { $match: { category } },
                { $sample: { size: 6 } }
            ])
        );
        
        const productsByCategory = await Promise.all(promises);
        const data = productsByCategory.flat();

        return NextResponse.json({result:true, data})
    } catch (error) {
        console.log("Error:", error)
        return NextResponse.json({message: "Some err while fetching products"})
    }
}