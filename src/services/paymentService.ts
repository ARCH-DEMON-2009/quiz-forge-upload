
import { createPremiumUser } from './trialService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processPayment = async (userNameForPremium: string): Promise<boolean> => {
  const isRazorpayLoaded = await initializeRazorpay();
  
  if (!isRazorpayLoaded) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return false;
  }

  return new Promise((resolve) => {
    const options = {
      key: 'rzp_test_9999999999', // Replace with your actual Razorpay key
      amount: 29900, // ₹299 in paise
      currency: 'INR',
      name: 'Test Sagar',
      description: 'Premium Access - 30 Days',
      image: '/favicon.ico',
      handler: async function (response: any) {
        console.log('Payment successful:', response);
        
        // Create premium user in Supabase
        const success = await createPremiumUser(userNameForPremium, response.razorpay_payment_id);
        
        if (success) {
          alert('Payment successful! You now have premium access.');
          window.location.reload(); // Refresh to update trial status
          resolve(true);
        } else {
          alert('Payment successful but failed to activate premium. Please contact support.');
          resolve(false);
        }
      },
      prefill: {
        name: userNameForPremium
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
          resolve(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      alert('Payment failed. Please try again.');
      resolve(false);
    });

    rzp.open();
  });
};
