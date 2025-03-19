// http://localhost:3000/dashboard/userCart
'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";


const CartPage = () => {

    const [products, setProducts] = useState([]);
    const router = useRouter()

    const Handle_BuyNow = async (product) => {
        const orderId = localStorage.getItem('orderId');
        try {
            let response = await fetch('http://localhost:3000/api/buyNow', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orderId, product })
            })

            response = await response.json()


            if (response.success) {
                toast.success("Order is purchased Successfully!!✅");
                console.log("Product purchase:", product);

            } else {
                toast.error(response.message || "Error while ordering item🤔");
                return false;
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Error during ordering item:", error);
            toast.error("Error, Please try again later.");
        }

    }


    useEffect(() => {

        async function fetchData() {
            try {
                const cartId = JSON.parse(localStorage.getItem('cartId'))
                let response = await fetch(`http://localhost:3000/api/getCartProduct/${cartId}`)

                let data = await response.json();
                console.log(data);

                if (data.cart) {
                    const products = data.cart.items;
                    console.log(products);

                    setProducts(products);

                    // Set the products state                    
                } else {
                    console.log("No products found.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchData();


    }, []);
    let image = "https://images.pexels.com/photos/12725050/pexels-photo-12725050.jpeg"

    if (products == []) return <p>Loading...</p>

    return (
        <div className="w-full bg-gradient-to-r from-green-200 to-blue-200 p-4 h-max">
            {products.length === 0 ? (
                <div className="text-center flex flex-col items-center justify-center h-64">
                    <img src="/images/empty-cart.avif" alt="Empty Cart" className="w-32 h-32 mb-4 opacity-80" style={{borderRadius:"50%"}} />
                    <p className="text-gray-600 text-lg font-semibold">Your cart is empty! 🛒</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => router.push("/dashboard")}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                        <div key={product.product_id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center flex-1">
                                <img 
                                    src={`/thumbnail/${product.product_id}.jpeg`}
                                    alt={product.product_title} 
                                    className="w-32 h-32 object-cover rounded-md mr-6"
                                />
                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-[#064420]">{product.product_title}</h3>
                                        <p className="text-gray-500">
                                            {product.rating} <span className="text-green-600 text-xl">⭐</span>
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-800 text-lg font-medium">Rs.{product.price}</p>
                                        <button 
                                            className="bg-[#1E3A8A] text-[#FFD700] px-4 py-2 rounded-lg hover:bg-[#1E3A9A] transition-colors"
                                            onClick={() => Handle_BuyNow(product)}
                                        >
                                            Buy Now⚡
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer />
        </div>
    );

}

export default CartPage