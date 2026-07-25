import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getMyOrders, updateOrderStatus, resolveImageUrl } from '../services/api';

const STATUS_STEPS = ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];

const Orders = () => {
  const { userInfo } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for updates every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      fetchOrders(); // refresh
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const getProgressPercentage = (status) => {
    if (status === 'cancelled') return 0;
    const index = STATUS_STEPS.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / STATUS_STEPS.length) * 100;
  };

  const isCustomer = userInfo?.role === 'customer';

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-semibold">Loading orders...</div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-12">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-black font-serif">
            {isCustomer ? 'My Orders & Deliveries' : 'Order Management'}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {isCustomer ? 'Track your active deliveries in real-time.' : 'Manage incoming orders and update delivery statuses.'}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="premium-card p-12 rounded-3xl text-center shadow-md">
          <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">inventory_2</span>
          <h3 className="text-lg font-bold text-black">No orders found</h3>
          <p className="text-sm text-gray-500 mt-2">
            {isCustomer ? "You haven't placed any orders yet." : "You don't have any incoming orders."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="premium-card p-6 rounded-3xl shadow-lg border border-black/5 flex flex-col md:flex-row gap-6 bg-white">
              
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-black/10">
                      {isCustomer ? (
                        <img 
                          src={order.business?.images?.[0] ? resolveImageUrl(order.business.images[0]) : '/login_nari_background.png'} 
                          alt="Business" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-800 font-bold text-xl">
                          {(order.customer?.name || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                        Order #{order._id.slice(-6)}
                      </p>
                      <h4 className="font-bold text-lg text-black">
                        {isCustomer ? order.business?.name : order.customer?.name}
                      </h4>
                      {order.items && order.items.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-600 font-medium">
                              <span className="font-bold">{item.quantity}x</span> {item.name}
                            </p>
                          ))}
                          <p className="text-sm font-bold text-emerald-600 pt-1">Total: ₹{order.totalAmount}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-emerald-600">{order.serviceName} - ₹{order.price}</p>
                      )}
                    </div>
                  </div>

                  {!isCustomer && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <select 
                      className="text-xs font-bold bg-black text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    >
                      {STATUS_STEPS.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
                      <option value="cancelled">CANCEL</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-black/5 rounded-xl">
                  <div className="col-span-2 sm:col-span-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Delivery Address</p>
                    <p className="text-xs font-semibold text-black mt-1">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Contact</p>
                    <p className="text-xs font-semibold text-black mt-1">{order.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Payment</p>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-xs font-bold text-black uppercase">{order.paymentMethod || 'COD'}</span>
                      {(() => {
                        const isCOD = !order.paymentMethod || order.paymentMethod.toLowerCase() === 'cod';
                        const isCompleted = order.paymentStatus === 'completed' || (order.status === 'delivered' && isCOD);
                        const statusText = isCompleted ? 'completed' : (order.paymentStatus || 'pending');
                        return (
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold w-max ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                            {statusText}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-black/10 pt-4 md:pt-0 md:pl-6">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Delivery Status</h5>
                
                {order.status === 'cancelled' ? (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 font-bold text-center">
                    Order Cancelled
                  </div>
                ) : (
                  <div className="relative pt-2">
                    {/* Progress Bar Background */}
                    <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 rounded-full z-0"></div>
                    
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute top-4 left-4 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-1000 ease-in-out"
                      style={{ width: `calc(${getProgressPercentage(order.status)}% - 2rem)` }}
                    ></div>

                    <div className="relative z-10 flex justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const stepIndex = STATUS_STEPS.indexOf(step);
                        const currentIndex = STATUS_STEPS.indexOf(order.status);
                        const isCompleted = stepIndex <= currentIndex;
                        const isActive = stepIndex === currentIndex;
                        
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 transition-colors duration-500 ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'}`}>
                              {isCompleted && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider text-center w-16 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {step.replace(/_/g, '\n')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {order.status === 'out_for_delivery' && isCustomer && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600 animate-pulse">local_shipping</span>
                    <p className="text-xs font-semibold text-blue-800">Your order is on the way! The provider is currently heading to your location.</p>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
