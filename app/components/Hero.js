'use client'
import { useRouter } from "next/navigation"


const  Hero = () => {

  const router = useRouter();

  const checkLogin = () =>{
    const data = localStorage.getItem("userData")
    if(data){
    router.push("/dashboard")    
    }else{
      router.push("/authentication")    
    }
  }

    return (
      <section className="relative bg-gradient-to-r from-green-100 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Sustainable Living Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover eco-friendly products that make a difference for you and the planet
            </p>
            <button onClick={checkLogin} className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700">
              Explore Now 
            </button>
          </div>
        </div>
      </section>
    )
  }

export default Hero