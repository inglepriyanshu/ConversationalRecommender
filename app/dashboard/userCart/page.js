// http://localhost:3000/dashboard/userCart
'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";


const UserCart = () => {

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
                <div className="w-full bg-gradient-to-r from-green-200 to-blue-200">
                    <div className="flex flex-wrap gap-5">
                        {products.map((product) => (
                            <div key={product._id} className="box w-64 max-h-max pb-2 m-4 border rounded-md"
                                style={{ backgroundColor: "#FFFFFF", boxShadow: "2px 6px 8px rgba(0, 0, 0.6, 0.3)", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-5px)";
                                    e.currentTarget.style.boxShadow = "4px 8px 16px rgba(0, 0, 0, 0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "2px 4px 8px rgba(0, 0, 0.1)";
                                }}>

                                <img src={image} alt={product.product_title} style={{ width: "260px", height: "220px", objectFit: "cover", borderRadius: "5px" }} />
                                <div className="flex justify-between">
                                    <h3 className="w-40 relative left-1" style={{ color: "064420", fontWeight: "600" }}>{product.product_title}</h3>
                                    <p className="text-gray-500 relative right-1">{product.rating} <span style={{ color: "Green", fontSize: "20px" }}>★</span> </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="relative top-4 left-1" style={{ color: "#333", fontSize: "16px" }}>Rs.{product.price}</p>
                                    <button className="border rounded-lg relative top-1 right-1" style={{ backgroundColor: "#1E3A8A", color: "#FFD700", border: "none", padding: "5px 10px" }} onClick={() => Handle_BuyNow(product)}>Buy Now⚡</button>
                                </div>

                            </div>
                        ))}
                    </div>
                    <ToastContainer />
                </div>
            )}
        </div>
    );

}

export default UserCart