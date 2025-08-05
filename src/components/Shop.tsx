import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ShopProps {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const Shop: React.FC<ShopProps> = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

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

  const addToCart = async(product:any) => {
    setCartItems((prev:any) => {
      const exists = prev.find((item:any) => item._id === product._id);
      if (exists) {
        return prev.map((item : any) =>            
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item 
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        return;
      }

      await axios.post("http://localhost:5000/api/cart/add", {
        product: product,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error : any) {
      console.error("❌ Error sending to backend:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-12">Shop All Products</h1>
        
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
      </div>
    </div>
  );
};

export default Shop; 