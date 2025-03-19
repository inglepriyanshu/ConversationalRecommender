import { NextResponse } from "next/server";
import { userModel } from "@/app/utils/userModel";
import mongoose from "mongoose";  
import { conneStr } from "@/app/utils/db";


await mongoose.connect(conneStr, { useNewUrlParser: true });

export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received request body:", body);
  
      let email = body.email;
  
      // Remove extra double quotes
      if (typeof email === "string") {
        email = email.replace(/^"(.*)"$/, "$1"); // ✅ Removes surrounding quotes
      }
  
      console.log("Extracted email:", email);
  
      if (!email) {
        return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
      }
  
      // Fetch user from database
      const savedUser = await userModel.findOne({ email });
      
  
      if (!savedUser) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ savedUser }), { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
  }
  