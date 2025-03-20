// localhost:3000/dashboard/profile
'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    city: '',
    contact: ''
  });

  useEffect(() => {
    const email = localStorage.getItem("userData");

    const handleProfile = async () => {
      try {
        let response = await fetch("/api/userProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        response = await response.json(); // Parse response JSON

        if (response.savedUser) {
          setUser(response.savedUser); // ✅ Set entire savedUser object
        } else {
          console.error("User not found:", response.message);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    handleProfile(); // ✅ Call function here
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      {/* Main container */}
      <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow-lg w-full max-w-4xl p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side with logo */}
          <div className="flex-none flex justify-center items-center p-6 bg-green-200 rounded-full w-48 h-48 self-center">
            <User size={120} className="text-green-700" strokeWidth={1.5} />
            <span className="sr-only">User Profile Logo</span>
          </div>

          {/* Right side with user information */}
          <div className="flex-grow">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Profile Information
            </h1>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">City</h2>
                <p className="text-lg font-medium text-gray-900">{user.city}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Email Address</h2>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Mobile Number</h2>
                <p className="text-lg font-medium text-gray-900">{user.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;