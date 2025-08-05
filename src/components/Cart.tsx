import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StripeCheckoutWrapper from './StripeCheckoutWrapper';

interface CartProps {
  items: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const Cart: React.FC<CartProps> = ({ items, setCartItems }) => {
  const [showStripe, setShowStripe] = useState(true);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async()=>{

    try {
      var res = await axios.post("http://localhost:5000/api/payments/create-payment-intent", {
                // your request body
                amount : total,
                currency : "inr"
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    'Content-Type': 'application/json'
                }
            }).then((val)=>{
              console.log("✅ Backend Response:", val?.data);
            }).catch(err => {console.log("error adding to cart : "+err);
            });
    } catch (error) {
      console.log("error handleCheckout : "+error);
      
    }
    setCartItems([])
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white font-['Montserrat']">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl flex flex-col">
        <h2 className="text-3xl font-extrabold mb-8 text-green-700 text-center">Your Cart</h2>

        {items.length === 0 ? (
          <div className="text-gray-500 text-center mb-8">Your cart is empty.</div>
        ) : (
          <>
            <div className="divide-y divide-green-100 mb-8">
              {items.map((item) => (
                <div key={item._id} className="flex items-center py-4 gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-green-100" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-900">{item.name}</div>
                    <div className="text-green-700 font-bold">${item.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-green-100 rounded hover:bg-green-200 font-bold">-</button>
                    <span className="px-2">{item.qty}</span>
                    <button className="px-2 py-1 bg-green-100 rounded hover:bg-green-200 font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-bold text-gray-900">Total</div>
              <div className="text-2xl font-extrabold text-green-700">${total.toFixed(2)}</div>
            </div>

            {!showStripe ? (
              <button
                className="w-full bg-green-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition shadow"
                onClick={() => {
                  handleCheckout();
                }}
              >
                Checkout
              </button>
            ) : (
              <StripeCheckoutWrapper amount={total} setCartItems={setCartItems} items={items} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
