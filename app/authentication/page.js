'use client'
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Login from "../components/userLogin";
import SignUp from "../components/userSignup";

const auth = () => {

    const [isLogin, setIsLogin] = useState(true); // Initially render the Login component

    const toggleAuth = () => {
        setIsLogin(!isLogin); // Toggle between Login and Signup
    };

    return (
        <div>
            <Navbar />            

            {isLogin ? (
                <Login toggleAuth={toggleAuth} />
            ) : (
                <SignUp toggleAuth={toggleAuth} /> 
            )}
            <div className="mt-32">
                <Footer />
            </div>
        </div>
    );
}

export default auth; 