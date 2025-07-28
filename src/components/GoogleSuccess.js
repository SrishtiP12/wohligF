// src/pages/GoogleSuccess.js or whatever component handles /google/success
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleSuccess = () => {
  const location = useLocation(); // Hook to access URL's location object
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('user') // Get the 'token' parameter from the URL

    if (token && email) {
      console.log('Received JWT:', token);
      // 1. Store the token in localStorage or sessionStorage
      localStorage.setItem('userToken', token);
      

      const userInfo = {
        email: email,
        // You can add more user info here if passed from backend, e.g., name: queryParams.get('name')
      };

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        sessionStorage.setItem('jwtToken', token); // Alternatively, for session-based storage


      //haven't implemented redux
      // 2. You might also dispatch a login action to update your app's state (e.g., Redux, Context)
      // dispatch(loginUser(token)); // Example if you have a Redux action

      // 3. Redirect the user to their main dashboard or home page
      navigate('/'); // Or '/' or wherever your main app starts
    } else {
      console.error('No token received from Google login callback.');
      // Handle cases where token is missing (e.g., redirect to login)
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div>
      <p>Processing Google login...</p>
      {/* You might show a loading spinner here */}
    </div>
  );
};

export default GoogleSuccess;