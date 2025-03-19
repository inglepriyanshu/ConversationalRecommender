import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function Products({ products }) {

    const router = useRouter()


    const Handle_addToCart = async (product) => {

        const data = localStorage.getItem('userData')
        if (!data) {
            toast.error('Login required!')
            setTimeout(() => {
                router.push("/authentication")
            }, 3000);
        }

        const cartId = localStorage.getItem('cartId'); 
        
        try {
            let response = await fetch('http://localhost:3000/api/addToCart', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({cartId, product})
            })
            
            response = await response.json()
            

            if (response.success) {
                toast.success("Item added to Cart Successfully!!✅");
                console.log("Product added:", product);

                // Delay navigation by 1 second 
                setTimeout(() => {
                    router.push("dashboard/userCart")
                },2000);
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


    return (
        <div id="product">
            <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">Top Offers</h1>
            <div className=" gap-2 grid grid-cols-4 m-10">
                {products.map((product) => (
                    <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
                        <img src={product.image} alt={product.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                        <p className="text-gray-500">{product.rating.rate}</p>
                        <button style={{ backgroundColor: "green", color: "white", border: "none", padding: "5px 10px" }}
                            onClick={() => Handle_addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    )
}