import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm({ amount, setCartItems, items }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert("Card information is missing.");
      setLoading(false);
      return;
    }

    let clientSecret;
    try {
      const { data } = await axios.post('/api/payments/create-payment-intent', {
        amount: Math.round(amount * 100),
        currency: 'usd',
      });
      clientSecret = data.clientSecret;
    } catch (error) {
      console.error("Payment intent creation failed:", error);
      alert("❌ Payment request failed.");
      setLoading(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Create order in backend
        try {
          const token = localStorage.getItem('userToken');
          console.log('Sending order with items:', items);
          
          const orderData = {
            paymentMethod: 'Stripe',
            paymentId: result.paymentIntent.id,
            items: items.map(item => ({
              _id: item._id,
              qty: item.qty,
              price: item.price
            }))
          };
          
          console.log('Order data being sent:', orderData);
          
          const orderResponse = await axios.post('/api/orders', orderData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Order creation response:', orderResponse.data);
          
          alert('✅ Order confirmed!');
          if (setCartItems) setCartItems([]);
          navigate('/');
        } catch (orderError) {
          console.error("Order creation failed:", orderError.response?.data || orderError);
          alert("Payment successful but order creation failed. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Stripe confirmation failed:", error);
      alert("❌ Payment confirmation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <CardElement className="border p-4 rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}