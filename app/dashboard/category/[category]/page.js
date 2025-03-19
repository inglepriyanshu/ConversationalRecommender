// dashboard/category/:cate_name

'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

const CategoryPage = () => {
    const router = useRouter()
    const { category } = useParams();  // Extract category from URL
    const [products, setProducts] = useState([]); // for rendering products cards w.r.t category
    const [product, setProduct] = useState([]); // for fetch product data

    //add to cart
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

                // Delay navigation by 1 second 
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

    //buy now 
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
        if (!category) return <p>Loading...</p>;

        async function fetchCategoryData() {
            try {
                const response = await fetch(`http://localhost:3000/api/ByCategory/${category}`);
                const data = await response.json();
                // console.log(data);
                setProducts(data.products);

            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        } 

        async function fetchData() {
            try {
                let response = await fetch('http://localhost:3000/api/getProducts');
                let data = await response.json();
                console.log(data);

                if (data.result) {
                    const products = data.data;
                    setProduct(products);
                    // Set the products state                    
                } else {
                    console.log("No products found.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        

        fetchCategoryData();
        fetchData();
    }, [category]);

    const image = "https://imgs.search.brave.com/v9XZqTXTlS9c4Qym9OqHaDin-5-nKdIzBg1C7Ye6lZA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saXZl/LXByb2R1Y3Rpb24u/d2Ntcy5hYmMtY2Ru/Lm5ldC5hdS9iMTFl/YWIxZDFiMmYwYzEz/ZDUyMjU5NjMyZTQ3/MmM5ND9pbXBvbGlj/eT13Y21zX2Nyb3Bf/cmVzaXplJmNyb3BI/PTE2ODYmY3JvcFc9/Mjk5OCZ4UG9zPTAm/eVBvcz01NSZ3aWR0/aD04NjImaGVpZ2h0/PTQ4NQ"

    return (
        <div className="w-full p-6">
            <h1 className="p-1 text-3xl font-extrabold text-gray-800 mb-6 border-b-4 border-yellow-400 inline-block rounded-lg">Category: {category}</h1>
            <div className="grid grid-cols-3 gap-8">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl p-4"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "4px 8px 16px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "2px 4px 8px rgba(0, 0, 0, 0.1)";
                        }}>

                        <img src={image} onClick={() => router.push(`/dashboard/products/${product.product_id}`)} alt={product.product_title} className="w-full h-48 object-cover rounded-lg hover:cursor-pointer" />
                        <div className="flex justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 mt-3">{product.product_title}</h3>
                            <p className="text-gray-500 relative right-1 top-3 m-1">{product.rating}⭐⭐⭐⭐⭐</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-700 font-bold text-lg mt-4 underline">Rs.{product.price}</p>
                            <button className="border rounded-lg relative top-2 bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold"  onClick={() => Handle_addToCart(product)}> Add to Cart </button>
                            <button className="relative top-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
                                onClick={() => Handle_BuyNow(product)}
                            >Buy Now⚡
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default CategoryPage;
