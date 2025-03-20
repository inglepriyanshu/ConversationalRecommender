import { cartModel } from "@/app/utils/cartModel";
import { conneStr } from "@/app/utils/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function POST(req) {
    try {
        let { cartId, product } = await req.json();
        let { product_id } = product;

        cartId = cartId.replace(/"/g, "");
        cartId = new mongoose.Types.ObjectId(cartId);

        const cart = await cartModel.findById({ _id: cartId });

        if (!cart) {
            return NextResponse.status(404).json({ message: "Cart not found", success: false });
        }

        // Filter out the product to be removed
        cart.items = cart.items.filter(item => item.product_id !== product_id);

        await cart.save();

        return NextResponse.json({
            success: true,
            message: "Item removed from cart successfully 👍"
        }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            success: false,
            message: "Some error during removing item from cart🤔"
        });
    }
}
