"use client";
import { useState } from "react";
import API from "../src/api/api";
import { useRouter } from "next/navigation";
import FormWrapper from "../src/components/globals/FormWrapper";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/waiters/auth/login", { username, password });
       localStorage.setItem("waiter", JSON.stringify(res.data));
      router.push("/dashboard");
    } catch (err) {
      alert("Invalid login");
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left notebook-style image */}
      <div className="hidden md:flex w-1/2 bg-gray-100 relative justify-center items-center">
        <div className="w-5/6 h-5/6 bg-white rounded-xl shadow-2xl p-6 overflow-hidden">
          <img
            src="https://b1858819.smushcdn.com/1858819/wp-content/uploads/bb-plugin/cache/La-Trattoria-Italian-Restaurant-Marrakech-Dinner-scaled-portrait-ef7d67a278587c5da51c5c1d40d0f1d9-8lqpiu67zscw.jpg?lossy=2&strip=1&webp=1"
            alt="login_image"
            className="object-cover w-full h-full rounded-xl"
          />
        </div>
      </div>

      {/* Right login form */}
      <div className="flex flex-col justify-center items-center w-full p-8 bg-gray-50 max-w-xl m-auto">
          <FormWrapper onSubmit={handleSubmit} title="Login" buttonText="Login">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </FormWrapper>
        </div>
    </div>
  );
}
