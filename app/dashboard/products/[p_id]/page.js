// localhost:3000/dashboard/products/:p_id
'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation'

const ProductPage = () => {
    
    const router = useRouter();
    const params = useParams();
    const { p_id } = params;

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!p_id) return;
            try {
                const response = await fetch(`http://localhost:3000/api/products/${p_id}`);
                const data = await response.json();
                console.log(data);

                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [p_id]); 

    const getColorEmoji = (color) => {
        switch (color.toLowerCase()) {
            case "red":
                return "🔴";
            case "blue":
                return "🔵";
            case "green":
                return "🟢";
            case "yellow":
                return "🟡";
            case "black":
                return "⚫";
            case "white":
                return "⚪";
            default:
                return "❓"; // Default icon
        }
    };

    //add to cart.
    const Handle_addToCart = async (product) => {

        const cartId = localStorage.getItem('cartId');

        try {
            let response = await fetch('http://localhost:3000/api/addToCart', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cartId, product })
            })

            response = await response.json()


            if (response.success) {
                toast.success("Item added to Cart Successfully!!✅");
                console.log("Product added:", product);

                setTimeout(() => {
                    router.push("/dashboard/userCart")
                }, 2000);
                
            } else {
                toast.error(response.message || "Error while adding item to cart🤔");
                return false;
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Error during adding item to cart:", error);
            toast.error("Error, Please try again later.");
        }

    }

    //buy items
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


    let image = "https://images.pexels.com/photos/12725050/pexels-photo-12725050.jpeg"

    if (!product) return <p>Loading...</p>;

    const productImage = `/thumbnail/${product.product_id}.jpeg`;

    return (
        <div className='flex m-10 rounded-md p-10 relative left-32 items-center' style={{ backgroundColor: "#F3F7F3", boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)", width: "900px" }}>
            <div id='img' className='w-96 h-72 rounded-md'>
                <img 
                    src={productImage}
                    alt={product.product_title} 
                    style={{ width: "450px", height: "288px", objectFit: "cover", borderRadius: "10px" }} 
                />
            </div>
            <div id='content' className='pl-6'>
                <h1 className='text-2xl font-bold m-3 underline'> {product.product_title} </h1>
                <h1 className='font-thin text-xs w-44 m-3'> {product.product_description} </h1>
                <h1 className='font-thin text-sm m-3'>In <span>{getColorEmoji(product.color)}</span> color.</h1>
                <p>⭐⭐⭐⭐⭐</p>
                <p className='m-2 font-semibold text-1/2'>Rs.{product.price}/- </p>
                <div id='btns' className='flex'>
                    <button className="mr-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-xl transition-all duration-300 flex items-center gap-2"                        
                        onClick={() => Handle_addToCart(product)}
                    > Add to Cart🛒
                    </button>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"                                                                    
                        onClick={() => Handle_BuyNow(product)} 
                    >Buy Now⚡
                    </button>
                </div>
            </div> 
            <ToastContainer />
        </div>
    );
}

export default ProductPage;