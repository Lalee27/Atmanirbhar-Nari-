import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const PaymentModal = ({ amount, onPaymentSuccess, onCancel }) => {
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields based on selected method
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing delay (2 seconds)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Notify parent component after a brief success animation
      setTimeout(() => {
        onPaymentSuccess({
          paymentMethod: method,
          paymentStatus: method === 'cod' ? 'pending' : 'completed'
        });
      }, 1500);
    }, 2000);
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
                <div className="animate-fade-in">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Enter UPI ID</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="example@upi" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              )}

              {method === 'card' && (
                <div className="animate-fade-in space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none text-sm bg-gray-50 focus:bg-white transition-colors tracking-widest"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/YY" 
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none text-sm bg-gray-50 focus:bg-white transition-colors text-center"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="•••" 
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none text-sm bg-gray-50 focus:bg-white transition-colors text-center tracking-widest"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
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
              100% Secure Simulated Payment
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
