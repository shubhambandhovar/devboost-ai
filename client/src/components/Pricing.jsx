import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { callApi } from '../utils/api';
import { Check, Loader2, Sparkles } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Load Razorpay Script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // 2. Call backend to create Razorpay Order
      const order = await callApi('/create-razorpay-order', 'POST');
      
      // 3. Open Razorpay modal (or mock instantly)
      if (order.mock) {
        console.log('Simulating Razorpay payment success...');
        const verifyRes = await callApi('/verify-razorpay-payment', 'POST', {
          razorpay_order_id: order.id,
          razorpay_payment_id: 'pay_mock_' + Date.now(),
          razorpay_signature: 'signature_mock_' + Date.now(),
          mock: true
        });
        if (verifyRes.success) {
          window.location.href = '/dashboard?success=true';
        } else {
          throw new Error('Mock payment failed');
        }
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'DevBoost AI',
        description: 'Upgrade to Pro Developer Plan',
        image: 'https://cdn-icons-png.flaticon.com/512/3658/3658773.png',
        order_id: order.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await callApi('/verify-razorpay-payment', 'POST', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              window.location.href = '/dashboard?success=true';
            } else {
              throw new Error('Signature verification failed');
            }
          } catch (verifyErr) {
            setError(verifyErr.message || 'Signature verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#4f46e5',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      setError(err.message || 'Error connecting to Razorpay');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white">
          Simple, Transparent <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Pricing</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Start for free to see the power of AI. Upgrade when you are ready to scale your development workflow.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center max-w-md mx-auto">
          {error}
          <p className="text-xs mt-2 text-gray-500">Make sure your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in the backend .env file.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="card border border-dark-lighter bg-dark p-8 rounded-2xl flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-2">Hobby</h2>
          <p className="text-gray-400 mb-6">Perfect to test out the DevBoost AI capabilities.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">$0</span>
            <span className="text-gray-500">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              10 AI Generations per month
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              Access to all 11 Developer Tools
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              Standard Support
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              Markdown Export
            </li>
          </ul>

          <button className="w-full py-3 px-4 bg-dark-lighter hover:bg-gray-800 text-white font-medium rounded-xl transition-colors border border-gray-700">
            Current Plan
          </button>
        </div>

        {/* Pro Tier */}
        <div className="card border-primary relative p-8 rounded-2xl flex flex-col bg-gradient-to-b from-dark to-dark-lighter shadow-[0_0_30px_rgba(79,70,229,0.15)] transform md:-translate-y-4">
          <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
            <span className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Most Popular
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Pro Developer</h2>
          <p className="text-gray-400 mb-6">For engineers who want to ship code 10x faster.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">$15</span>
            <span className="text-gray-500">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-primary" />
              <strong className="text-white">Unlimited</strong> AI Generations
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-primary" />
              Priority GPT-4 / Claude 3 Access
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-primary" />
              Priority Email Support
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-primary" />
              Early access to new features
            </li>
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
