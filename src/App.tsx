import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Shop from "./components/Shop";
import Categories from "./components/Categories";
import Contact from "./components/Contact";
import 'react-toastify/dist/ReactToastify.css';
import GoogleSuccess from "./components/GoogleSuccess";

interface MainAppProps {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  user: any;
}


const MainApp: React.FC<MainAppProps> = ({ cartItems, setCartItems, user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String>();

  // Timer state for Exclusive Offer
  const [timer, setTimer] = useState({ days: 2, hours: 14, mins: 36, secs: 0 });

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

//   console.log(products);
  

  // Timer logic
  useEffect(() => {
    // Set initial offer end time (e.g., 2 days, 14 hours, 36 mins from now)
    const offerEnd:any = new Date(Date.now() + ((2 * 24 + 14) * 60 + 36) * 60 * 1000);
    const interval = setInterval(() => {
      const now:any = new Date();
      const diff = offerEnd - now;
      if (diff <= 0) {
        setTimer({ days: 0, hours: 0, mins: 0, secs: 0 });
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimer({ days, hours, mins, secs });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //auth Logic
  

  const bestSelling = products.slice(0, 3);
  // Remove: const navigate = useNavigate();

  // Add to cart handler (for demo, just adds first product)
  const addToCart = async(product:any) => {
    console.log("add to cart func");
    
    setCartItems((prev:any) => {
      const exists = prev.find((item:any) => item._id === product._id);
      console.log(exists);
      
      if (exists) {
        console.log(exists);
        
        return prev.map((item : any) =>            
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item 
            
        );
      }
      return [...prev, { ...product, qty: 1 }];
    } 
    );
    // Send to backend
    try {
      const token = localStorage.getItem("userToken");
      console.log(token);
      

      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        return;
      }
    
      // console.log(product);
      // console.log(`${localStorage.getItem('userToken')}`);
    
    
      var res = await axios.post("http://localhost:5000/api/cart/add", {
          // your request body
          product: product,
      }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
              'Content-Type': 'application/json'
          }
      }).then((val:any)=>{
        console.log("✅ Backend Response:", val?.data);
      }).catch(err => {console.log("error adding to cart : "+err);
      });
  
    
  } catch (error : any) {
    console.error("❌ Error sending to backend:", error.response?.data || error.message);
  }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col font-['Montserrat']">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 shadow-sm bg-[#C6F3D8]/100 border-b sticky top-0 z-20">
        <div className="font-extrabold text-2xl tracking-tight text-green-700">
          <Link to="/">Délla</Link>
        </div>
        <ul className="hidden md:flex space-x-10 text-gray-700 font-medium text-lg">
          <li><Link to="/" className="hover:text-green-700 transition">Home</Link></li>
          <li><Link to="/shop" className="hover:text-green-700 transition">Shop</Link></li>
          <li><Link to="/categories" className="hover:text-green-700 transition">Categories</Link></li>
          <li><Link to="/contact" className="hover:text-green-700 transition">Contact</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full px-2 py-0.5">{cartItems.length}</span>}
          </Link>
          {user ? (
            <Link to="/profile"><button className="border border-green-700 text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-700 hover:text-white transition text-base shadow-sm">My Profile</button></Link>
          ) : (
            <Link to="/login"><button className="border border-green-700 text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-700 hover:text-white transition text-base shadow-sm">Login</button></Link>
          )}
        </div>
      </nav>

<section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 md:py-32 bg-gradient-to-br from-[#C6F3D8] to-[#E1FAE8]">
  {/* Left: Text */}
  <div className="flex-1 max-w-xl z-10">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-[#1F3D2B]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      Discover and<br />Define Your Own<br />Fashion.
    </h1>
    <p className="text-lg md:text-xl text-[#1F3D2B] mb-8 max-w-md opacity-90">
      Dive into curated collections of timeless fashion and exclusive accessories — tailored just for you.
    </p>
    {/* <button
      className="bg-[#23472B] text-white px-10 py-4 rounded-xl shadow-lg font-bold text-lg hover:bg-[#1a3520] transition-all duration-300"
      style={{ boxShadow: '0 8px 24px 0 #23472B33' }}
    >
      EXPLORE NOW
    </button> */}
  </div>

  {/* Right: Image in Card */}
  <div className="flex-1 flex justify-center mt-12 md:mt-0 z-10">
    <div className="relative bg-[#5AC37B] rounded-[3rem] w-[340px] h-[460px] overflow-hidden shadow-2xl">
      <img
        src="https://images.pexels.com/photos/32935715/pexels-photo-32935715.jpeg"
        alt="Woman in coat posing outdoors"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      {/* Optional gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[3rem]" />
    </div>
  </div>
</section>



     {/* Best Selling Products */}
<section className="py-20 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">Best Selling</h2>
        <p className="text-center text-gray-500 mb-12 text-lg">Our most-loved pieces, handpicked for you.</p>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center md:items-stretch">
            {bestSelling.map((item:any, idx) => (
              <div key={item?._id || idx} className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center w-72 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-green-50">
                <img src={item?.image || 'https://via.placeholder.com/160x192'} alt={item.name} className="rounded-2xl w-48 h-56 object-cover mb-5 shadow-md" />
                <div className="font-semibold text-lg mb-1 text-gray-900">{item.name}</div>
                <div className="text-green-700 text-xl font-bold mb-2">${item.price}</div>
                <div className="text-yellow-500 text-base">★ {item.rating || 4.8} <span className="text-gray-400 text-sm">({item.numReviews || 100})</span></div>
                <button onClick={() => {addToCart(item); console.log("add to cart button pressed")
                }} className="mt-4 bg-green-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition shadow">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-10">
          <Link to="#all-products" className="border border-green-700 text-green-700 px-8 py-2 rounded-full font-semibold hover:bg-green-700 hover:text-white transition text-lg shadow">View All</Link>
        </div>
      </section>


      {/* All Products Grid */}
<section className="py-24 px-6 md:px-12 bg-white max-w-7xl mx-auto" id="all-products">
  <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">All Products</h2>
  {loading ? (
    <div className="text-center text-gray-400">Loading...</div>
  ) : error ? (
    <div className="text-center text-red-500">{error}</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {products.map((item:any, idx) => (
        <div
          key={item._id || idx}
          className="bg-green-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center border border-green-100"
        >
          <img
            src={item.image || '/images/default.jpg'}
            alt={item.name}
            className="rounded-xl mb-5 w-44 h-52 object-cover shadow-md"
          />
          <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.name}</h3>
          <p className="text-green-700 text-lg font-bold mb-1">${item.price}</p>
          <div className="text-yellow-500 text-base">
            ★ {item.rating || 4.5}{' '}
            <span className="text-gray-400 text-sm">({item.numReviews || 50})</span>
          </div>
          <button
            onClick={() => addToCart(item)}
            className="mt-4 bg-green-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition shadow"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )}
</section>


      {/* Exclusive Offer */}
<section className="py-20 px-8 bg-gradient-to-r from-green-100 to-green-200 flex flex-col md:flex-row items-center gap-12 md:gap-24 rounded-3xl shadow-xl max-w-6xl mx-auto my-20">
  <div className="flex-1 flex justify-center">
    <img
      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
      alt="Exclusive"
      className="rounded-2xl w-64 h-80 object-cover shadow-2xl border-8 border-white"
    />
  </div>

  <div className="flex-1 max-w-lg">
    <h3 className="text-2xl font-bold mb-4 text-green-800">Exclusive Offer</h3>
    <p className="text-gray-700 mb-8 text-lg">
      Limited time only! Get an extra <span className="font-bold text-green-700">20% off</span> on selected items.
      Hurry up before the offer ends.
    </p>

    <div className="flex space-x-6 mb-8">
      {[
        { label: 'Days', value: String(timer.days).padStart(2, '0') },
        { label: 'Hours', value: String(timer.hours).padStart(2, '0') },
        { label: 'Mins', value: String(timer.mins).padStart(2, '0') },
        { label: 'Secs', value: String(timer.secs).padStart(2, '0') },
      ].map((time, index) => (
        <div key={index} className="bg-white rounded-xl px-6 py-4 text-center shadow">
          <div className="font-bold text-2xl text-green-700">{time.value}</div>
          <div className="text-xs text-gray-500">{time.label}</div>
        </div>
      ))}
    </div>

    <Link
      to="#best-selling"
      className="bg-green-700 text-white px-10 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-green-800 transition"
    >
      Get Offer
    </Link>
  </div>
</section>


<section className="py-20 px-8 bg-white max-w-7xl mx-auto" id="categories">
  <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Categories</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
    
    {/* Accessories */}
    <div className="bg-green-50 rounded-3xl shadow p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-green-100">
      <img
        src="https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&h=400"
        alt="Accessories"
        className="rounded-xl mb-5 w-40 h-44 object-cover shadow"
      />
      <div className="font-semibold text-xl mb-2 text-green-800">Accessories</div>
      <div className="text-gray-600 text-base text-center">
        Complete your look with our unique accessories collection.
      </div>
    </div>

       {/* Dresses - Pretty Dress */}
    <div className="bg-green-50 rounded-3xl shadow p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-green-100">
      <img
        src="https://images.pexels.com/photos/5886041/pexels-photo-5886041.jpeg?auto=compress&cs=tinysrgb&h=400"
        alt="Dresses"
        className="rounded-xl mb-5 w-40 h-44 object-cover shadow"
      />
      <div className="font-semibold text-xl mb-2 text-green-800">Dresses</div>
      <div className="text-gray-600 text-base text-center">
        Discover the latest in designer dresses and evening wear.
      </div>
    </div>

    {/* Outerwear - Casual Jeans */}
    <div className="bg-green-50 rounded-3xl shadow p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-green-100">
      <img
        src="https://images.pexels.com/photos/5325881/pexels-photo-5325881.jpeg?auto=compress&cs=tinysrgb&h=400"
        alt="Outerwear"
        className="rounded-xl mb-5 w-40 h-44 object-cover shadow"
      />
      <div className="font-semibold text-xl mb-2 text-green-800">Outerwear</div>
      <div className="text-gray-600 text-base text-center">
        Our outerwear keeps you stylish and warm all season.
      </div>
    </div>

  </div>
</section>



      {/* Footer */}
      <footer className="bg-green-900 text-white py-14 px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="font-extrabold text-2xl mb-3">Délla</div>
            <div className="text-green-100 text-base mb-6">Elevate your wardrobe with our curated collection of modern, minimal fashion essentials.</div>
            <div className="flex space-x-4">
              <button type="button" className="bg-transparent border-none p-0 m-0 text-inherit hover:text-green-700 transition">FB</button>
              <button type="button" className="bg-transparent border-none p-0 m-0 text-inherit hover:text-green-700 transition">IG</button>
              <button type="button" className="bg-transparent border-none p-0 m-0 text-inherit hover:text-green-700 transition">TW</button>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3 text-lg">Shop</div>
            <ul className="text-green-100 text-base space-y-2">
              <li><Link to="#all-products" className="hover:text-green-300">All Products</Link></li>
              <li><Link to="#best-selling" className="hover:text-green-300">Best Sellers</Link></li>
              <li><Link to="#" className="hover:text-green-300">New Arrivals</Link></li>
              <li><Link to="#" className="hover:text-green-300">Sale</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 text-lg">Company</div>
            <ul className="text-green-100 text-base space-y-2">
              <li><Link to="#" className="hover:text-green-300">About Us</Link></li>
              <li><Link to="#" className="hover:text-green-300">Contact</Link></li>
              <li><Link to="#" className="hover:text-green-300">Careers</Link></li>
              <li><Link to="#" className="hover:text-green-300">Blog</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 text-lg">Stay Up To Date</div>
            <form className="flex flex-col space-y-3">
              <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded text-green-900 bg-green-50 border-none focus:ring-2 focus:ring-green-300" />
              <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded font-semibold transition">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="text-center text-green-200 text-sm mt-12">&copy; {new Date().getFullYear()} Délla. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default function App() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState(null);

  // Effect to load user from localStorage on initial app load
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    console.log("Stored User : "+storedUser);
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // You might also want to load cart items from localStorage here if applicable
  }, []);

  const handleAuthSuccess = (userData : any) => {
    setUser(userData); // Set the user state
    // Token is already stored in localStorage by Login/Register component
  };

  if(cartItems){
    console.log(cartItems);
    
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp cartItems={cartItems} setCartItems={setCartItems} user={user} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegisterSuccess={handleAuthSuccess}/>} />
        <Route path="/cart" element={<Cart items={cartItems} setCartItems={setCartItems} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/google/success" element={<GoogleSuccess/>} />
        <Route path="/shop" element={<Shop cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}