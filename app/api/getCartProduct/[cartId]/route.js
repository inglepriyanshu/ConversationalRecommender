import { cartModel } from "@/app/utils/cartModel"
import { conneStr } from "@/app/utils/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET(req, {params}) {
    try {
        const {cartId } = await params
        const cart = await cartModel.findById({ _id: cartId });
        return NextResponse.json(
            {
                success: true,
                cart
            })
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "ERROR! Fetching cart."
            })
    }
}