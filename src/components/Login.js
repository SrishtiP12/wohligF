import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/users/login", { email, password });
      if (onLogin) {
        const { token, ...userData } = res.data;

        console.log("token :: "+token);
        

        // 1. Store the token and user info in localStorage
        localStorage.setItem('userToken', token);
        localStorage.setItem('userInfo', JSON.stringify(userData)); // Store other user details

        if (onLogin) { // Renamed from onRegister for clarity
          onLogin(userData); // Pass user data (excluding token, as token is in localStorage)
        }

        // 3. Redirect to a dashboard or home page after successful registration
        navigate('/'); // Or navigate('/dashboard')
      
      }
      // onLogin(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    }
  };

  // const handleGoogleLogin = async() => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/auth/google")
  //     if(res.data){
  //       console.log(res.data);
  //     }else{
  //       console.log("null google");
  //     }
      
  //   } catch (error) {
  //     console.log("google err :: "+error);
  //   }
  // };

 const handleGoogleLogin = () => {
    // This will cause a full page redirect to your backend route
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white font-['Montserrat'] px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-green-700 mb-8">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold text-lg transition-all shadow"
          >
            Sign In
          </button>
        </form>

        <div className="relative w-full my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-200"></div>
          </div>
          <div className="relative flex justify-center text-sm text-gray-500 bg-white px-4">
            <span>Or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-green-700 text-green-700 py-3 rounded-xl font-medium text-lg hover:bg-green-50 transition shadow-sm"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.13 13.13 17.57 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"
            />
            <path
              fill="#FBBC05"
              d="M10.67 28.28c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.19C.9 15.36 0 19.55 0 24c0 4.45.9 8.64 2.69 12.26l7.98-6.19z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.6c-2.01 1.35-4.59 2.15-7.96 2.15-6.43 0-11.87-3.63-14.33-8.85l-7.98 6.19C6.71 42.18 14.82 48 24 48z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-700 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
