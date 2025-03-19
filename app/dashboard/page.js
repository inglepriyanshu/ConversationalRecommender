// http://localhost:3000/dashboard
'use client'

import Carousel from "../components/carousel";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/navigation";

// Static categories with sub-categories
const categories = [
    { name: "Shoes", subCategories: ["Sneakers", "Formal Shoes", "Sandals"] },
    { name: "Clothing", subCategories: ["Shirts", "T-Shirts", "Jeans"] },
    { name: "Electronics", subCategories: ["Laptops", "Smartphones", "Headphones"] }
];

const mainDashboard = () => {
    const router = useRouter();

    return (
        <div>
            <div className="m-3">
                <Carousel />
            </div>
            <div className="flex gap-4">
                <aside className="p-4 w-64 bg-gray-200 rounded-md">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Categories</h1>
                    <ul>
                        {categories.map(cat => (
                            <li key={cat.name} 
                                className="relative group py-2 pl-2 hover:bg-gray-300 cursor-pointer"
                                onClick={() => router.push(`/dashboard/category/${cat.name}`)}>
                                {cat.name}
                                <div className="absolute left-full top-0 ml-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg hidden group-hover:block z-10">
                                    <ul>
                                        {cat.subCategories.map(sub => (
                                            <li 
                                                key={sub} 
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/sub-category/${sub}`) }}>
                                                {sub}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="w-full bg-gradient-to-r from-blue-300 to-green-200 border rounded-md p-4">
                    {/* The ProductCard now shows grouped products by category */}
                    <ProductCard />
                </main>
            </div>            
        </div>
    );
}

export default mainDashboard;