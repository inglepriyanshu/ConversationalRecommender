import { conneStr } from "@/app/utils/db";
import { orderModel } from "@/app/utils/orderModel";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose"; 
import { NextResponse } from "next/server";


await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function POST(req) {
    try {
        let { orderId, product } = await req.json();
        let { product_id, product_title, price} = product;        
        
        const Curr_product = await productModel.findOne({product_id:product_id})
        console.log(Curr_product);
        
        const description = Curr_product.product_description;
        
        orderId = orderId.replace(/"/g, ""); // Removes extra quotes        
        // console.log(orderId);
        
        // orderId = new mongoose.Types.ObjectId(orderId); // Convert to ObjectId

        const order = await orderModel.findById({ _id: orderId });
        // console.log(order);                

        if (!order) {
            order.orders = [];
        }
        
        const existingorder = order.orders.find((order)=> order.productId === product_id)
        // db productId try to match with current order product_id         
        
        if (existingorder) {
            existingorder.quantity += 1
        } else {            
            order.orders.push({
                productId:product_id,
                productName:product_title,
                price:price,
                description:description,                
                quantity: 1,
                // rating:rating
            })
        }

        await order.save();
        console.log("Product Purchase:", product);

        return NextResponse.json(
            { success: true, message: "Order purchased successfully 👍" },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error:", error)
        return NextResponse.json(
            { success: false, message: "Some error during purchasing order🤔" }
        )
    }

}


