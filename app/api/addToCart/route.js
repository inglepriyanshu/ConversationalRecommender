import { cartModel } from "@/app/utils/cartModel";
import { conneStr } from "@/app/utils/db";
import { productModel } from "@/app/utils/productModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function POST(req) {
    try {
        let { cartId, product } = await req.json();
        let { product_id, product_title, price} = product;
        
        const Curr_product = await productModel.findOne({product_id:product_id})
        const description = Curr_product.product_description;
        
        cartId = cartId.replace(/"/g, ""); // Removes extra quotes        
        // console.log(cartId);
        
        cartId = new mongoose.Types.ObjectId(cartId); // Convert to ObjectId

        const cart = await cartModel.findById({ _id: cartId });
        // console.log(cart);
        
        if (!cart) return NextResponse.status(404).json({ message: "Cart not found", success: false });

        if (!cart.items) {
            cart.items = [];
        }
        
        const existingItem = cart.items.find((item)=> item.product_id === product_id)
        // db productId try to match with current item product_id         
        
        if (existingItem) {
            existingItem.quantity += 1
        } else {            
            cart.items.push({
                product_id,
                product_title,
                price,
                description,
                quantity: 1
            })
        }

        await cart.save();
        console.log("Product Added:", product);

        return NextResponse.json(
            { success: true, message: "Item added to Cart successfully 👍" },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error:", error)
        return NextResponse.json(
            { success: false, message: "Some error during adding item to cart🤔" }
        )
    }

}


