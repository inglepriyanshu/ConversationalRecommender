'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState(null);
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = localStorage.getItem("userData");    
    

    /**  if user is not logged in & try to navigate dashboard .
    we redirect them to sign up page*/
    if (!data && pathName == "/dashboard") {
      router.push("/authentication");
    }
    /** if user logged in & try to go signup . we redirect them to dashboad */
    else if (data && pathName == "/authentication") {
      router.push("/dashboard")
    }
    else {
      setDetails(JSON.parse(data));
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("cartId");
    localStorage.removeItem("orderId");
    router.push("/authentication");
  };

  const handleSearchChange = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    const params = new URLSearchParams(searchParams);
    if (newSearchQuery) {
      params.set('search', newSearchQuery);
    } else {
      params.delete('search');
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-green-600">
              SmartCart
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                         shadow-sm placeholder:text-gray-400"
                placeholder="What you want today..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 justify-end">
            <Link
              href="/dashboard/profile"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <User className="h-6 w-6" />

            </Link>

            <Link
              href="/dashboard/userCart"
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />

              <span className="absolute top-0 right-0 h-5 w-5 text-xs 
                           rounded-full flex items-center justify-center">
                
              </span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut className="h-6 w-6" /> 
            </button> 
             
            <Link href='/dashboard/chatbot'>
              {/* <img  src='/images/google-gemini-icon.svg' alt='icon' className='w-10 h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors' /> */}
              <img  src='/ai_loading.gif' alt='icon' className='w-8 h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors' />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}