import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RpkOIH8cHotDVAkQfCHKpcfQeHIutyF8prpMmC24MYMo3AeGbBb5XVO20JV4a2gKaXtktOiNHmKmcrbK3f0hczQ00WPb5kb0s');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace with actual cart total
    const { data } = await axios.post('/api/payments/create-payment-intent', {
      amount: 5000, // 50.00 USD
      currency: 'usd',
    });

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Call backend to confirm order/save data
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay
      </button>
    </form>
  );
};

const StripeCheckout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripeCheckout;
