import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true }, // Reference to user
  orders: [
    {
      productId: { type: Number, ref: "Product", required: true, index:true },
      productName: { type: String, required:true}, 
      quantity: { type: Number, required: true, default:1 },
      price: { type: Number, required: true }, // Price of the product 
      description: { type: String, required:true }, 
    //   rating: { type: Number, required:true }, 
    },
  ],
});

// Export the model
export const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
