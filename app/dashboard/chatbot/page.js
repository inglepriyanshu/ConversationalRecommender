// pages/dashboard/chatbot.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';
import Image from 'next/image';

let index = 0;

const INITIAL_BOT_MESSAGE = {
  sender: 'bot',
  text: 'How can I help you today?'
};

const initialPrompts = [
  "Hmm, based on your requirements, I would suggest these products for you.",
  "Sounds good, I picked these products for you based on your requirements.",
  "Great, here are some products that match your preferences.",
  "Alright, I've found some products that align with what you're looking for.",
  "Based on your input, here are some recommendations for you.",
  "Excellent, I have selected some products that might interest you."
];

const updatePrompts = [
  "Hmm, based on your changes in requirements, I think these products are suitable.",
  "Alright, I've updated the recommendations based on your new preferences.",
  "Got it, here are some revised product suggestions for you.",
  "I see your changes; these updated products should better match your needs.",
  "Thanks for the update! I've reselected some products that fit your revised criteria.",
  "Based on your latest input, here are some new recommendations.",
  "Understood, I've refreshed the list of products according to your changes.",
  "Sure, here are some updated product picks that align with your new requirements.",
  "Okay, I've adjusted the recommendations based on your changes.",
  "Let me show you some updated product suggestions based on your revised preferences."
];

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const chatEndRef = useRef(null);
  const mainRef = useRef(null);

  // Load saved messages and index on initial mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedIndex = localStorage.getItem('chatIndex');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([INITIAL_BOT_MESSAGE]);
    }
    
    if (savedIndex) {
      index = parseInt(savedIndex);
    }
  }, []);

  // Save messages and index when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      localStorage.setItem('chatIndex', index.toString());
    }
  }, [messages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current && mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReset = () => {
    setIsResetting(true);
    
    // Add woosh animation class to main content
    if (mainRef.current) {
      mainRef.current.classList.add('animate-woosh');
    }

    // After animation completes
    setTimeout(() => {
      setMessages([INITIAL_BOT_MESSAGE]);
      index = 0;
      localStorage.setItem('chatMessages', JSON.stringify([INITIAL_BOT_MESSAGE]));
      localStorage.setItem('chatIndex', '0');
      setIsResetting(false);
      
      if (mainRef.current) {
        mainRef.current.classList.remove('animate-woosh');
      }
    }, 500);
  };

  // Modified: fetch product details and return them
  const fetchRecommendedProducts = async (productIds) => {
    try {
      const limitedIds = productIds.slice(0, 3);
      const fetchedProducts = await Promise.all(
        limitedIds.map(async (id) => {
          const res = await fetch(`http://localhost:3000/api/products/${id}`);
          return res.json();
        })
      );
      return fetchedProducts;
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      return [];
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = input;
    const currentIndex = index; // Store current index before incrementing
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentMessage, index: index }),
      });
      const data = await response.json();
      console.log(data);
      console.log(index);
      index++; // Increment index after storing current value

      let products = [];
      if (data.product_ids && data.product_ids.length > 0) {
        products = await fetchRecommendedProducts(data.product_ids);
      }

      const botMessage = { 
        sender: 'bot', 
        text: currentIndex === 0  // Use stored index value for checking
          ? initialPrompts[Math.floor(Math.random() * initialPrompts.length)]
          : updatePrompts[Math.floor(Math.random() * updatePrompts.length)],
        products: products 
      };
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
    <div className="max-w-3xl mx-auto flex flex-col h-[90vh] bg-gradient-to-br from-gray-50 to-white p-4">
      <header className="text-center mb-2 relative">
        <h1 className="text-4xl font-extrabold text-gray-800">Cart Curator</h1>
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <Image
            src="/reload.png"
            alt="Reset Chat"
            width={24}
            height={24}
            className={`transition-transform duration-500 ${isResetting ? 'animate-spin' : 'hover:rotate-180'}`}
          />
        </button>
      </header>

      <main
        ref={mainRef}
        className="flex-grow bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 rounded-lg shadow-md p-4 overflow-y-auto space-y-3 transition-all duration-500 scroll-smooth max-h-[calc(90vh-140px)]"
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div
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
            {msg.sender === 'bot' && msg.products && msg.products.length > 0 && (
              <div className="mt-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {msg.products.map((prod, pidx) => (
                    <ProductCard key={pidx} product={prod} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Loader2 className="h-6 w-6 text-gray-600 animate-spin" />
          </div>
        )}
        <div ref={chatEndRef} className="h-0" />
      </main>

      <form className="mt-2 flex items-center space-x-2" onSubmit={handleSend}>
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
