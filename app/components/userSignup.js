'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignUp = ({toggleAuth}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [c_password, setc_password] = useState("");
    const [city, setCity] = useState("");
    const [contact, setContact] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        // Check if password and confirm password match
        if (password !== c_password) {
            toast.error("Passwords do not match.");
            return; // Stop further execution if passwords don't match
        }
        if (!name || !email || !password || !c_password || !city || !contact) {
            setError(true)
            toast.error("All fields are required")
            return;
        } else {
            setError(false)
        }

        try {
            let result = await fetch("http://localhost:3000/api/userAuth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Make sure the content type is set
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    city,
                    contact,
                }),
            });

            const response = await result.json();

            // Ensure response contains success
            if (response.success) {
                toast.success(response.message || "Successful registration!");
                console.log(response)
                // Ensure `response.result` exists and is valid
                const { savedUser } = response;

                localStorage.setItem("userData", JSON.stringify(savedUser.email))
                localStorage.setItem("userName", JSON.stringify(savedUser.name))
                localStorage.setItem("cartId", JSON.stringify(savedUser.cart));
                localStorage.setItem("orderId", JSON.stringify(savedUser.order));
                // Delay navigation by 1 second
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);

            } else {
                toast.error(response.message || "User already registered.");
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Error during signup:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="w-96 mb-3 p-6 bg-black mt-8 rounded-lg  text-white flex items-center justify-center flex-col">
                <div className="my-3">
                    <Link href="/" className="text-3xl font-bold text-green-400">
                        SmartCart
                    </Link>
                    <br />
                </div>
                <div>
                    Name: <br />
                    <input
                        className="relative top-1 text-black p-2 rounded-lg border focus:outline-none  bg-yellow-100"
                        type="text"
                        required
                        placeholder="Ratan Tata"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
                <br />
                <div>
                    Email: <br />
                    <input
                        className="relative top-1 text-black p-2 rounded-lg border focus:outline-none  bg-yellow-100"
                        type="text"
                        placeholder="ex.abc@gmail.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <br />
                <div>
                    City: <br />
                    <input
                        className="relative left-1 border focus:outline-none  bg-yellow-100 text-black p-2 rounded-lg"
                        type="text"
                        required
                        placeholder="ex.Kalyan"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                    />
                </div>
                <br />
                <div>
                    Contact No. : <br />
                    <input
                        className="relative left-1 text-black p-2 rounded-lg border focus:outline-none  bg-yellow-100"
                        type="number"
                        required
                        onChange={(e) => setContact(e.target.value)}
                        value={contact}
                    />
                </div>
                <br />
                <div>
                    Password: <br />
                    <input
                        className="relative left-1 text-black p-2 rounded-lg border focus:outline-none  bg-yellow-100"
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <br />
                <div>
                    Confirm Password: <br />
                    <input
                        className="relative left-1 text-black p-2 rounded-lg border focus:outline-none  bg-yellow-100"
                        type="password"
                        required
                        onChange={(e) => setc_password(e.target.value)}
                        value={c_password}
                    />
                </div>
                <div className="flex flex-col border border-none">
                    <button onClick={handleSignup}
                        className="w-44 mt-9 bg-green-300 text-black px-4 py-2 rounded-3xl hover:bg-green-500">
                        Sign Up 
                    </button>
                    {/* <hr className="text-white mt-3"/> */}
                    <button onClick={toggleAuth}
                        className="w-44 my-3 bg-black text-green-300 px-4 py-2  border-green-300 border-2 rounded-3xl hover:bg-zinc-700">
                        Login 
                    </button>
                </div>
                {/* Toast Container to display notifications */}
                <ToastContainer />
            </div>
        </div>
    );
};

export default SignUp;
