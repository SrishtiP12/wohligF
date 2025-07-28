import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Profile = () => {

  const[user , setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProfile = async () => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('userToken');

    // 2. Check if a token exists
    if (!token) {
      console.log("No token found. User is not logged in.");
      // You might want to redirect to login page here or set an error state
      // navigate('/login'); // If using react-router-dom
      return; // Stop execution if no token
    }

    try {
      const resp = await axios.get("/api/users/profile", { // This is the correct way
        headers: { // 'headers' is the key, and its value is an object
          Authorization: `Bearer ${token}`, // Correct format for sending JWT
          'Content-Type': 'application/json', // Often useful, though not strictly required for GET
        },
      });
      console.log("Profile data:", resp?.data);
      setUser(resp?.data)
      // Update your component state with the profile data, e.g., setUserProfile(resp.data);
    } catch (error) {
      console.error("Error fetching profile:", error); // Use console.error for errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        // Handle specific error codes, e.g., 401 Unauthorized
        if (error.response.status === 401) {
          console.log("Token invalid or expired. Please log in again.");
          localStorage.removeItem('userToken'); // Clear invalid token
          localStorage.removeItem('userInfo'); // Clear user info
          // navigate('/login'); // Redirect to login page
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    }
  };

  fetchProfile(); // Call the async function
}, [])

const handleLogout = () => {
    localStorage.removeItem("userToken"); 
    console.log("logout");
    navigate("/login")
}
  


   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white font-['Montserrat']">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-6 text-green-700">My Profile</h2>
        <div className="text-lg text-gray-800 mb-2">Name: {user?.name || 'N/A'}</div>
        <div className="text-lg text-gray-800 mb-2">Email: {user?.email || 'N/A'}</div>
        <div onClick={()=>{handleLogout()}} className='pt-10 cursor-pointer font-bold mb-2 text-xl text-green-500'>logout</div>
      </div>
    </div>
  );
}

export default Profile
