'use client'
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
    const router = useRouter();

    // If a single product prop is passed, render a simple card
    if (product) {
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <img 
                    src={`/thumbnail/${product.product_id}.jpeg`}
                    alt={product.product_title} 
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => router.push(`/dashboard/products/${product.product_id}`)}
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.product_title}</h3>
                    <p className="text-xl text-gray-700 font-bold">Rs.{product.price}</p>
                    <button 
                        onClick={() => {
                            // Replace with your add-to-cart handler as needed
                            console.log("Add to Cart", product);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md mt-2"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        );
    }

    // ...existing grouping behavior for pages without a product prop...
    const [products, setProducts] = useState([]);

    const Handle_addToCart = async (product) => {
        const cartId = localStorage.getItem('cartId');
        try {
            let response = await fetch('http://localhost:3000/api/addToCart', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cartId, product })
            });
            response = await response.json();
            if (response.success) {
                toast.success("Item added to Cart Successfully!!✅");
                console.log("Product added:", product);
                setTimeout(() => {
                    router.push("dashboard/userCart")
                }, 2000);
            } else {
                toast.error(response.message || "Error while adding item to cart🤔");
                return false;
            }
        } catch (error) {
            console.error("Error during adding item to cart:", error);
            toast.error("Error, Please try again later.");
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('http://localhost:3000/api/getProducts');
                let data = await response.json();
                console.log(data);
                if (data.result) {
                    setProducts(data.data);
                } else {
                    console.log("No products found.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchData();
    }, []);

    const groupedProducts = products.reduce((acc, curr) => {
        const cat = curr.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(curr);
        return acc;
    }, {});

    const defaultImage = "https://images.pexels.com/photos/12725050/pexels-photo-12725050.jpeg";

    return (
        <div className="p-4">
            {Object.keys(groupedProducts).map(category => (
                <div key={category} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {groupedProducts[category].map(prod => (
                            <div key={prod.product_id} 
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <img 
                                    src={`/thumbnail/${prod.product_id}.jpeg`}
                                    onClick={() => router.push(`/dashboard/products/${prod.product_id}`)}
                                    alt={prod.product_title} 
                                    className="w-full h-48 object-cover cursor-pointer" 
                                />
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">{prod.product_title}</h3>
                                        <p className="text-gray-500 flex items-center">
                                            {prod.rating} <span className="text-green-600 ml-1 text-xl">★</span>
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl text-gray-700 font-bold">Rs.{prod.price}</p>
                                        <button 
                                            onClick={() => Handle_addToCart(prod)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <ToastContainer />
        </div>
    );
};

export default ProductCard;