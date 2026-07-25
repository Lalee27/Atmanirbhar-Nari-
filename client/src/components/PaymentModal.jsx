import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/api';

const PaymentModal = ({ amount, onPaymentSuccess, onCancel }) => {
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields based on selected method
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (method === 'cod') {
      // COD Logic
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          onPaymentSuccess({ paymentMethod: 'cod', paymentStatus: 'pending' });
        }, 1500);
      }, 1000);
      return;
    }

    try {
      // 1. Create Order on Backend
      const { data: order } = await createRazorpayOrder({ amount });

      // 2. Open Razorpay Checkout Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
        amount: order.amount,
        currency: order.currency,
        name: "Aatmanirbhar Nari",
        description: "Payment for your order",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature
            await verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            setSuccess(true);
            setTimeout(() => {
              onPaymentSuccess({
                paymentMethod: 'online',
                paymentStatus: 'completed',
                razorpayPaymentId: response.razorpay_payment_id
              });
            }, 1500);
          } catch (err) {
            alert('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#059669" // Emerald 600
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Error initiating payment. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full flex flex-col items-center justify-center space-y-4 shadow-2xl animate-fade-in-up border border-emerald-500/30">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-500 text-center text-sm">
            {method === 'cod' 
              ? 'Order placed successfully. Please pay on delivery.' 
              : 'Your payment was processed successfully.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-black/10 overflow-hidden animate-fade-in-up my-8">
        
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white text-center relative">
          <button 
            type="button"
            onClick={onCancel}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <p className="text-sm font-semibold opacity-90 uppercase tracking-widest mb-1">Amount to Pay</p>
          <h2 className="text-4xl font-extrabold">₹{amount}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm font-bold text-gray-700 mb-4">Select Payment Method</p>
          
          <div className="space-y-3 mb-6">
            {/* UPI Option */}
            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${method === 'upi' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="upi" 
                checked={method === 'upi'} 
                onChange={() => setMethod('upi')}
                className="w-5 h-5 text-emerald-600 accent-emerald-600"
              />
              <span className="ml-3 flex-1 font-semibold text-gray-800">UPI (GPay, PhonePe, Paytm)</span>
              <span className="material-symbols-outlined text-gray-400">qr_code_scanner</span>
            </label>

            {/* Card Option */}
            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${method === 'card' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="card" 
                checked={method === 'card'} 
                onChange={() => setMethod('card')}
                className="w-5 h-5 text-emerald-600 accent-emerald-600"
              />
              <span className="ml-3 flex-1 font-semibold text-gray-800">Credit / Debit Card</span>
              <span className="material-symbols-outlined text-gray-400">credit_card</span>
            </label>

            {/* COD Option */}
            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${method === 'cod' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="cod" 
                checked={method === 'cod'} 
                onChange={() => setMethod('cod')}
                className="w-5 h-5 text-emerald-600 accent-emerald-600"
              />
              <span className="ml-3 flex-1 font-semibold text-gray-800">Cash on Delivery</span>
              <span className="material-symbols-outlined text-gray-400">local_shipping</span>
            </label>
          </div>

          <form onSubmit={handlePay}>
            {/* Dynamic Form Fields based on method */}
            <div className="min-h-[100px] mb-6">
              {method === 'upi' && (
                <div className="animate-fade-in p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    You will be securely redirected to Razorpay to complete your UPI payment.
                  </p>
                </div>
              )}

              {method === 'card' && (
                <div className="animate-fade-in p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    You will be securely redirected to Razorpay to complete your Card payment.
                  </p>
                </div>
              )}

              {method === 'cod' && (
                <div className="animate-fade-in p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    You will pay the exact amount to the delivery executive when the item is delivered to your address.
                  </p>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  {method === 'cod' ? 'Confirm Order' : `Pay ₹${amount}`}
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              100% Secure Payment by Razorpay
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
