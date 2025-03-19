// http://localhost:3000/dashboard
'use client'

import Carousel from "../components/carousel";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import DashboardNavbar from "../components/dashboardNavbar";

// Static categories with sub-categories
const categories = [
    { name: "Shoes", subCategories: ["Sneakers", "Formal Shoes", "Sandals"] },
    { name: "Clothing", subCategories: ["Shirts", "T-Shirts", "Jeans"] },
    { name: "Electronics", subCategories: ["Laptops", "Smartphones", "Headphones"] }
];

const mainDashboard = () => {
    const router = useRouter();
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    const toggleCategory = (categoryName) => {
        setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    };

    const handleCategoryDoubleClick = (categoryName) => {
        router.push(`/dashboard/category/${categoryName}`);
    };

    return (
        <div>
            <DashboardNavbar setSearchQuery={setSearchQuery} /> {/* Pass setSearchQuery */}
            <div className="m-3">
                <Carousel />
            </div>
            <div className="flex gap-4">
                <aside className="p-4 w-64 bg-gray-200 rounded-md">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Categories</h1>
                    <ul>
                        {categories.map(cat => (
                            <li key={cat.name} className="mb-2">
                                <div 
                                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-300 cursor-pointer rounded-md"
                                    onClick={() => toggleCategory(cat.name)}
                                    onDoubleClick={() => handleCategoryDoubleClick(cat.name)}
                                >
                                    <span>{cat.name}</span>
                                    <span className="transition-transform duration-200" 
                                          style={{ transform: expandedCategory === cat.name ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                        ›
                                    </span>
                                </div>
                                <ul className={`ml-4 overflow-hidden transition-all duration-200 ${
                                    expandedCategory === cat.name ? 'max-h-40 mt-2' : 'max-h-0'
                                }`}>
                                    {cat.subCategories.map(sub => (
                                        <li 
                                            key={sub}
                                            className="py-1 px-2 hover:bg-gray-300 cursor-pointer rounded-md text-sm"
                                            onClick={() => router.push(`/dashboard/sub-category/${sub}`)}
                                        >
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))} 
                    </ul>
                </aside>
                <main className="w-full bg-gradient-to-r from-blue-300 to-green-200 border rounded-md p-4">
                    <ProductCard searchQuery={searchQuery} /> {/* Pass searchQuery */}
                </main>
            </div>            
        </div>
    );
}

export default mainDashboard;