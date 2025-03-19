'use client'
import ProductCard from "@/app/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const subCategories = () => {
  const params = useParams()
  const { sub } = params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`http://localhost:3000/api/getProductsBySubCategory/${sub}`);
      const data = await res.json(); 
      console.log(data);
      
      if (data.result) {
        console.log("Products fetched successfully", data.data);
        setProducts(data.data);
      } else {
        console.log("Error fetching products");
      }
    }
    fetchProducts();
  }, [sub]);

  return (
    <div className="w-full bg-gradient-to-r from-orange-300 via-green-100 to-blue-200  p-4">
      <main className="grid grid-cols-3 gap-4 w-4/5 mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  )
}

export default subCategories;