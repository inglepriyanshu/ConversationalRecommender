import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
    trim: true, // Removes extra spaces
    index:true
  },
  password: {
    type: String,
    required: true,
    minlength: [5, "Password must be at least 5 characters long"],
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    trim: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId, //  ObjectId for cart items of specific user in their model
    ref: "Cart", // Reference to the Cart schema
  }, 
  order: {
    type: mongoose.Schema.Types.ObjectId, //  ObjectId for cart items of specific user in their model
    ref: "order", // Reference to the Cart schema
  }
}, { timestamps: true })


export const userModel = mongoose.models.user
  || mongoose.model("user", userSchema)