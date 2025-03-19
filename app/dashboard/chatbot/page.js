// pages/dashboard/chatbot.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';


let index = 0;

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, products]);

  // Modified: fetch product details limited to 3 products
  const fetchRecommendedProducts = async (productIds) => {
    try {
      // Limit to at most 3 product IDs
      const limitedIds = productIds.slice(0, 3);
      const fetchedProducts = await Promise.all(
        limitedIds.map(async (id) => {
          const res = await fetch(`http://localhost:3000/api/products/${id}`);
          return res.json();
        })
      );
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Append the user's message
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = input;
    setInput('');
    setLoading(true);

    try {
      // Call the API
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentMessage, index: index }),
      });
      const data = await response.json(); 
      
      console.log(data);
      console.log(index);
      index++;

      // If product_ids is returned, fetch details for a maximum of 3 products
      if (data.product_ids && data.product_ids.length > 0) {
        await fetchRecommendedProducts(data.product_ids);
      }

      // Append bot reply message
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-extrabold text-gray-800">Cart Curator</h1>
        <p className="mt-1 text-gray-500">How can we help you today?</p>
      </header>

      <main className="flex-grow bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-lg shadow-md p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-3 rounded-xl max-w-md text-sm transition-all duration-200 ${
                msg.sender === 'user'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-yellow-200 text-gray-800 shadow'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Loader2 className="h-6 w-6 text-gray-600 animate-spin" />
          </div>
        )}
        <div ref={chatEndRef} />
        
        {/* Modified: Render recommended product cards in a grid with max 3 columns */}
        {products.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((prod, idx) => (
                <ProductCard key={idx} product={prod} />
              ))}
            </div>
          </div>
        )}
      </main>

      <form className="mt-4 flex items-center space-x-2" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg flex items-center justify-center transition"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
