'use client'
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
  
const Navbar = () => {

  const router = useRouter()
  const pathName = usePathname()
  const [details, setDetails] = useState();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const name = localStorage.getItem("userName");

    if (data && pathName == "/authentication") {
      // if user logged in & try to go login page, we redirect them to "/"
      router.replace("/")
    } else if (!data && pathName == "/dashboard") {
      router.push("/authentication")
    } else {
      setDetails(JSON.parse(data));
    }
  }, [])
 
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("cartId");
    localStorage.removeItem("orderId");
    router.push("/authentication");
  };


  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            SmartCart             
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/#products" className="text-gray-600 hover:text-gray-900">Products</Link>
            <Link href="/#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
          </div>
          {
            details  ?
              (
                <>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) :
              (
                <>
                  <button className="flex gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <Link href="/authentication"> Login </Link>
                    <LogIn />
                  </button>
                </>
              )
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar;

