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
            <ToastContainer />
        </div>
    )
}