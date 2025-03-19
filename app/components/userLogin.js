"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";


const Login = ({toggleAuth}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const HandleLogin = async () => {
    if (!email || !password) {
      setError(true);
      toast.error("All fields required!!");
      return;
    } else {
      setError(false);
    }

    try {
      let response = await fetch("http://localhost:3000/api/userAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, login: true }),
      });
      response = await response.json(); // Await the response parsing

      if (response.success) {
        toast.success("Login Successful 👍");
        localStorage.setItem("userData", JSON.stringify(response.savedUser.email));
        localStorage.setItem("userName", JSON.stringify(response.savedUser.name));
        localStorage.setItem("cartId", JSON.stringify(response.savedUser.cart));
        localStorage.setItem("orderId", JSON.stringify(response.savedUser.order));

        // Delay navigation by 1 second 
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000);
      } else {
        toast.error(response.message || "User not found or credentials did not match!");
        return false;
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error during login:", error);
      toast.error("Error while logging in, Please try again later.");
    }
  };
  console.log(email, password);


  return (
    <div className="flex items-center justify-center flex-col">
      <div className="w-96 h-108 bg-black rounded-lg mt-8 text-white flex items-center justify-center flex-col">
        <div className="my-3">
          <Link href="/" className="text-3xl font-bold text-green-400">
            SmartCart
          </Link>
        </div>        
        
        <div>
          Email: <br />
          <input
            className="relative top-1 text-black p-2 rounded-lg"
            type="text"
            placeholder="abc@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div>
          Password: <br />
          <input
            className="relative top-1 text-black p-2 rounded-lg"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>       
        <div className="flex flex-col border border-none">
          <button onClick={HandleLogin} 
          className="w-44 mt-9 bg-green-300 text-black px-4 py-2 rounded-3xl hover:bg-green-500">
            Login
          </button>          
          {/* <hr className="text-white mt-3"/> */}
          <button onClick={toggleAuth}
          className="w-44 my-3 bg-black text-green-300 px-4 py-2  border-green-300 border-2 rounded-3xl hover:bg-zinc-700">
            Sign Up 
          </button>           
        </div>
        {/* Toast Container to display notifications */}           
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
