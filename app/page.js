'use client'
import Hero from "./components/Hero";
import Navbar from "./components/Navbar"
import Features from "./components/Features";
import Products from "./components/HomeProduct";
import Testimonials from "./components/Testimonal";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";


// localhost:3000 

const Home = () => {

   const [products, setProducts] = useState([]);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();
            setProducts(data);
         } catch (error) {
            console.error("Error fetching products:", error);
         }
      };
      fetchProducts();
   }, []);


   return (
      <div className="min-h-screen">
         <Navbar />
         <Hero />
         <Features />
         <Products products={products} />
         <Testimonials />
         <Footer />
      </div>
   );
}

export default Home;