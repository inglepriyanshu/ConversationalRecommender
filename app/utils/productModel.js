import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    product_id: Number,
    product_title: String,
    price:Number, 
    brand:String,
    color:String,
    category:String,
    sub_category:String,
    product_description:String
})

export const productModel = mongoose.models.Product || 
mongoose.model("Product",productSchema);