import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true }, // Reference to user
  items: [
    {
      product_id: { type: Number, ref: "Product", required: true, index:true },
      product_title: { type: String, required:true}, 
      quantity: { type: Number, required: true, default:1 },
      price: { type: Number, required: true }, // Price of the product 
      description: { type: String, required:true }, 
    },
  ],
});

// Export the model
export const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
