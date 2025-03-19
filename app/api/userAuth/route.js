import { conneStr } from "@/app/utils/db";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import { userModel } from "@/app/utils/userModel";
import { cartModel } from "@/app/utils/cartModel";
import { orderModel } from "@/app/utils/orderModel";



await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function GET() {
    const data = await userModel.find();
    console.log(data);

    return NextResponse.json({ result: true, data });
}

export async function POST(request) {
    try {
        const data = await request.json();
        const { name, email, password, city, contact } = data;
        let savedUser;

        if (data.login) {
            // use it for login
            savedUser = await userModel.findOne({ email });

            if (!savedUser) {
                return NextResponse.json(
                    { success: false, message: "User not found!" },
                    { status: 404 }
                );
            }

            // Compare the hashed password
            const isPasswordCorrect = await bcryptjs.compare(
                password,
                savedUser.password
            );
            if (!isPasswordCorrect) {
                return NextResponse.json(
                    { success: false, message: "Invalid credentials!" },
                    { status: 401 }
                );
            }

            // If login is successful, send a response
            return NextResponse.json(
                { success: true, message: "Login successful 👍", savedUser },
                { status: 200 }
            );
        } else {
            // use for sign up

            // Check if user already exists
            const user = await userModel.findOne({ email });
            if (user) {
                const msg = "User already registered";
                console.log("Error:", msg);
                return NextResponse.json({ message: msg }, { status: 409 });
            }

            // Hash password
            const salt = await bcryptjs.genSalt(10);
            const hashPassword = await bcryptjs.hash(password, salt);

            // Create new user document
            const newUser = new userModel({
                name,
                email,
                password: hashPassword, // Replace with hashed password
                city,
                contact,
            });

            await newUser.save();

            // Create a cart and link it to the user
            const cart = new cartModel({ user: newUser._id });
            await cart.save();

            // Update user with the cart ID
            newUser.cart = cart._id;
            savedUser = await newUser.save(); 

            // Create a cart and link it to the user
            const order = new orderModel({ user: newUser._id });
            await order.save();

            // Update user with the cart ID
            newUser.order = order._id;
            savedUser = await newUser.save();
            
            console.log(savedUser);
            return NextResponse.json({ savedUser, success: true });
        }

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
