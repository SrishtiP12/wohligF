import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  onRegisterSuccess: (data: any) => void; 
}

const Register: React.FC<RegisterProps> = ( {onRegisterSuccess} ) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/users/register", { name, email, password });
      if (onRegisterSuccess) {
        const { token, ...userData } = res.data;

        console.log("token :: "+token);
        

        // 1. Store the token and user info in localStorage
        localStorage.setItem('userToken', token);
        localStorage.setItem('userInfo', JSON.stringify(userData)); // Store other user details

        if (onRegisterSuccess) { // Renamed from onRegister for clarity
          onRegisterSuccess(userData); // Pass user data (excluding token, as token is in localStorage)
        }

        // 3. Redirect to a dashboard or home page after successful registration
        navigate('/'); // Or navigate('/dashboard')
        // onRegister(res.data);
      }
      // Redirect or success message can go here
    } catch (err : any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const handleGoogleLogin = async() => {
      try {
        const res = await axios.get("/auth/google")
        if(res.data){
          console.log(res.data);
        }else{
          console.log("null google");
        }
        
      } catch (error) {
        console.log("google err :: "+error);
      }
    };
  
   

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white font-['Montserrat']">
      <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-6 text-green-700">Create an Account</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 outline-none transition"
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-800 transition mb-4"
          >
            Register
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-green-700 text-green-700 py-3 rounded-lg font-semibold text-lg hover:bg-green-50 transition shadow mb-4"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.13 13.13 17.57 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.67 28.28c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.19C.9 15.36 0 19.55 0 24c0 4.45.9 8.64 2.69 12.26l7.98-6.19z"/>
              <path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.6c-2.01 1.35-4.59 2.15-7.96 2.15-6.43 0-11.87-3.63-14.33-8.85l-7.98 6.19C6.71 42.18 14.82 48 24 48z"/>
            </g>
          </svg>
          Sign up with Google
        </button>

        <p className="text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}


export default Register