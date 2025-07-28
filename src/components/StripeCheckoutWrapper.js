import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51RpkOIH8cHotDVAkQfCHKpcfQeHIutyF8prpMmC24MYMo3AeGbBb5XVO20JV4a2gKaXtktOiNHmKmcrbK3f0hczQ00WPb5kb0s'); // your publishable key

export default function StripeCheckoutWrapper({ amount, setCartItems, items }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} setCartItems={setCartItems} items={items} />
    </Elements>
  );
}
