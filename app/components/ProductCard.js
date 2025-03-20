'use client'
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const ProductCard = ({ product, searchQuery, products, categoryOrder }) => {
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        async function fetchSearchResults() {
            if (searchQuery) {
                setLoading(true);
                try {
                    // Use absolute URL
                    const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery)}`);
                    const data = await response.json();
                    
                    if (data.error) {
                        console.error('Search API error:', data.error);
                        toast.error('Error searching products');
                        return;
                    }
                    
                    console.log('Search results:', data.results);
                    setSearchResults(data.results || []);
                } catch (error) {
                    console.error('Search error:', error);
                    toast.error('Error searching products');
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
                // Fetch regular products for category display
                fetchProducts();
            }
        }

        async function fetchProducts() {
            try {
                setLoading(true);
                let response = await fetch('http://localhost:3000/api/getProducts');
                let data = await response.json();
                if (data.result) {
                    setAllProducts(data.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Error fetching products");
            } finally {
                setLoading(false);
            }
        }

        fetchSearchResults();
    }, [searchQuery]);

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
                    router.push("/dashboard/userCart");
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

    const Handle_BuyNow = async (product) => {
        const orderId = localStorage.getItem('orderId');
        try {
            let response = await fetch('http://localhost:3000/api/buyNow', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orderId, product })
            });

            response = await response.json();

            if (response.success) {
                toast.success("Order is purchased Successfully!!✅");
                console.log("Product purchase:", product);
            } else {
                toast.error(response.message || "Error while ordering item🤔");
                return false;
            }
        } catch (error) {
            console.error("Error during ordering item:", error);
            toast.error("Error, Please try again later.");
        }
    };

    // If a single product prop is passed, render a simple card
    if (product) {
        console.log("Rendering single product:", product);
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <img
                    src={product?.product_id ? `/thumbnail/${product.product_id}.jpeg` : "/thumbnail/default.jpg"}
                    alt={product?.product_title || "Product Image"}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => router.push(`/dashboard/products/${product.product_id}`)}
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {product?.product_title || "Untitled Product"}
                    </h3>
                    <p className="text-xl text-gray-700 font-bold">
                        Rs. {product?.price || "N/A"}
                    </p>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => Handle_addToCart(product)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md"
                        >
                            Add to Cart
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md"
                            onClick={() => Handle_BuyNow(product)}
                        >
                            Buy Now ⚡
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Group products by category when not searching
    const groupedProducts = !searchQuery ? products?.reduce((acc, curr) => {
        const cat = curr.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        if (acc[cat].length < 6) { // Limit to 6 products per category
            acc[cat].push(curr);
        }
        return acc;
    }, {}) : null;

    // Ensure we have unique keys for search results
    const generateUniqueKey = (prod) => {
        return prod.product_id || prod._id || `${prod.product_title}-${prod.price}`.replace(/\s+/g, '-');
    };

    return (
        <div className="p-4">
            {loading ? (
                <p>Loading products...</p>
            ) : searchQuery ? (
                searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {searchResults.map(prod => (
                            <div 
                                key={generateUniqueKey(prod)}
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
                                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md"
                                            onClick={() => Handle_BuyNow(prod)}
                                        >
                                            Buy Now ⚡
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products found for "{searchQuery}".</p>
                )
            ) : (
                // Category-based view
                categoryOrder?.map(category => (
                    groupedProducts?.[category] && (
                        <div key={`category-${category}`} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {groupedProducts[category].map(prod => (
                                    <div 
                                        key={generateUniqueKey(prod)}
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
                                                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md"
                                                >
                                                    Add to Cart
                                                </button>
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md"
                                                    onClick={() => Handle_BuyNow(prod)}
                                                >
                                                    Buy Now ⚡
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))
            )}
            <ToastContainer />
        </div>
    );
};

export default ProductCard;
