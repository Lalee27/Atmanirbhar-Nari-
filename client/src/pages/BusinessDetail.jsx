import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBusinessById, submitInquiry, createOrder, resolveImageUrl, submitReport } from '../services/api';
import ServiceMediaGallery from '../components/ServiceMediaGallery';
import PaymentModal from '../components/PaymentModal';

const getCategoryDetails = (category) => {
  const foodCats = ['Tiffin Services', 'Cooking Classes'];
  const productCats = ['Tailoring & Fashion', 'Handicrafts', 'Home Decors', 'Gardening & Plants'];
  const serviceCats = ['Beauty & Wellness', 'Fitness & Yoga', 'Event Management'];
  const eduCats = ['Tuition & Coaching'];

  if (foodCats.includes(category)) return { section: "Our Menu", action: "Add to Cart", icon: "add_shopping_cart", actionPrefix: "Pay", addressLabel: "Delivery Address" };
  if (productCats.includes(category)) return { section: "Our Catalog", action: "Add to Cart", icon: "add_shopping_cart", actionPrefix: "Pay", addressLabel: "Delivery Address" };
  if (serviceCats.includes(category)) return { section: "Our Services", action: "Book Appointment", icon: "calendar_month", actionPrefix: "Book for", addressLabel: "Your Location/Address" };
  if (eduCats.includes(category)) return { section: "Our Courses", action: "Enroll Now", icon: "school", actionPrefix: "Pay", addressLabel: "Your Address" };

  return { section: "Our Offerings", action: "Add to Cart", icon: "add_shopping_cart", actionPrefix: "Pay", addressLabel: "Address" };
};

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
  
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ type: 'Spam', description: '' });
  
  const [showOrder, setShowOrder] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cart, setCart] = useState([]);
  const [orderForm, setOrderForm] = useState({ deliveryAddress: '', contactNumber: '' });
  
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    getBusinessById(id)
      .then(({ data }) => setBusiness(data))
      .catch(() => setBusiness(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await submitInquiry({ businessId: id, ...inquiryForm });
      setSubmitMsg('Inquiry sent! The entrepreneur will contact you soon.');
      setShowInquiry(false);
      setInquiryForm({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
    } catch {
      setSubmitMsg('Failed to send inquiry. Please try again.');
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await submitReport({ targetBusiness: id, ...reportForm });
      setSubmitMsg('Report submitted. Our team will review it shortly.');
      setShowReport(false);
      setReportForm({ type: 'Spam', description: '' });
    } catch {
      setSubmitMsg('Failed to submit report. Please try again.');
    }
  };

  const addToCart = (svc) => {
    setCart((prev) => {
      const existing = prev.find(item => item.name === svc.name);
      if (existing) {
        return prev.map(item => item.name === svc.name ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...svc, quantity: 1 }];
    });
  };

  const removeFromCart = (svc) => {
    setCart((prev) => {
      const existing = prev.find(item => item.name === svc.name);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter(item => item.name !== svc.name);
      }
      return prev.map(item => item.name === svc.name ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const getQuantity = (svc) => {
    const item = cart.find(i => i.name === svc.name);
    return item ? item.quantity : 0;
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const initiatePayment = (e) => {
    e.preventDefault();
    setShowOrder(false);
    setShowPayment(true);
  };

  const handleOrder = async (paymentDetails) => {
    try {
      await createOrder({
        businessId: id,
        items: cart.map(c => ({ name: c.name, price: c.price, quantity: c.quantity, image: c.image })),
        totalAmount,
        deliveryAddress: orderForm.deliveryAddress,
        contactNumber: orderForm.contactNumber,
        ...paymentDetails
      });
      setSubmitMsg('Success! Your order has been placed. Track it in your Dashboard.');
      setShowPayment(false);
      setOrderForm({ deliveryAddress: '', contactNumber: '' });
      setCart([]);
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
      setShowPayment(false);
    }
  };

  if (loading) {
    return <p className="text-center py-24 text-on-surface-variant">Loading details...</p>;
  }

  if (!business) {
    return (
      <div className="text-center py-24">
        <p className="text-body-lg">Business not found.</p>
        <Link to="/marketplace" className="text-primary font-semibold mt-4 inline-block">Back to Marketplace</Link>
      </div>
    );
  }

  const location = [business.location?.area, business.location?.city, business.location?.state].filter(Boolean).join(', ') || 'Local area';
  const today = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
  const hours = business.availability?.[today] || 'See profile';

  const catDetails = getCategoryDetails(business.category);
  const isServiceOrEdu = ['Beauty & Wellness', 'Fitness & Yoga', 'Event Management', 'Tuition & Coaching'].includes(business.category);

  return (
    <div className="max-w-[1140px] mx-auto px-5 md:px-16 py-8 space-y-8 pb-32 relative">
      <Link to="/marketplace" className="text-secondary flex items-center gap-2 hover:underline font-semibold">
        <span className="material-symbols-outlined">arrow_back</span> Back to Marketplace
      </Link>

      {submitMsg && <p className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-800 font-semibold">{submitMsg}</p>}

      <section className="mb-8">
        <div className="relative h-[400px] rounded-xl overflow-hidden border border-outline-variant shadow-md">
          <img className="w-full h-full object-cover" src={business.images?.[0] ? resolveImageUrl(business.images[0]) : 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000'} alt={business.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-headline-lg font-bold">{business.name}</h1>
                <p className="text-label-lg font-semibold bg-white/20 inline-block px-3 py-1 rounded-full mt-2 backdrop-blur-sm">{business.category}</p>
                <div className="flex flex-wrap items-center gap-4 text-label-lg mt-4">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> {location}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">schedule</span> {hours}</span>
                  {business.rating > 0 && <span className="flex items-center gap-1 text-alert-gold"><span className="material-symbols-outlined text-[18px] fill-current">star</span> {business.rating}</span>}
                </div>
              </div>
              {business.isVerified && (
                <span className="hidden sm:flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-label-md font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified</span> Verified Business
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl border border-black/10 shadow-sm">
            <h2 className="text-headline-md text-primary font-bold mb-4">About</h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">{business.description}</p>
          </section>
          
          {business.category === 'Tuition & Coaching' && (business.demoVideoUrl || business.meetingLink) && (
            <section className="bg-white p-8 rounded-2xl border border-black/10 shadow-sm space-y-4">
              <h2 className="text-headline-md text-primary font-bold">Online Coaching Details</h2>
              {business.demoVideoUrl && (
                <div>
                  <h3 className="text-label-lg font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined">play_circle</span> Demo Video</h3>
                  <div className="rounded-lg overflow-hidden border border-black/10 aspect-video max-w-2xl">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={business.demoVideoUrl} 
                      title="Demo Video" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              {business.meetingLink && (
                <div className="pt-2">
                  <h3 className="text-label-lg font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined">video_camera_front</span> Live Classes</h3>
                  <a href={business.meetingLink.startsWith('http') ? business.meetingLink : `https://${business.meetingLink}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-semibold transition-colors border border-blue-200">
                    Join Meeting Link
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              )}
            </section>
          )}
          
          {business.images?.length > 1 && (
            <ServiceMediaGallery images={business.images} />
          )}

          {business.menuImages?.length > 0 && (
            <section className="space-y-6 pt-4">
              <h2 className="text-headline-md font-bold border-b pb-4 text-emerald-700 flex items-center gap-2">
                <span className="material-symbols-outlined">restaurant_menu</span>
                Menu Card
              </h2>
              <p className="text-body-md text-on-surface-variant">Click on the image to view it in full size.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.menuImages.map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-black/10 shadow-sm cursor-zoom-in bg-white" onClick={() => window.open(img.startsWith('http') ? img : resolveImageUrl(img), '_blank')}>
                    <img src={img.startsWith('http') ? img : resolveImageUrl(img)} alt={`Menu Card ${i + 1}`} className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6 pt-4">
            <h2 className="text-headline-md font-bold border-b pb-4">{catDetails.section}</h2>
            
            {(!business.services || business.services.length === 0) ? (
              <p className="text-on-surface-variant italic">No items listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.services.map((svc, i) => {
                  const qty = getQuantity(svc);
                  return (
                    <div key={i} className="liquid-glass border border-black/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex flex-col gap-3">
                        {svc.image && (
                          <div className="h-40 rounded-xl overflow-hidden relative border border-black/5">
                            <img src={svc.image.startsWith('http') ? svc.image : resolveImageUrl(svc.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={svc.name} />
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{svc.name}</h3>
                            {svc.description && <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{svc.description}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-extrabold text-emerald-600">₹{svc.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        {qty > 0 && !isServiceOrEdu ? (
                          <div className="flex items-center justify-between bg-primary/10 rounded-xl p-1 border border-primary/20">
                            <button onClick={() => removeFromCart(svc)} className="w-10 h-10 flex items-center justify-center text-primary font-bold rounded-lg hover:bg-primary/20 cursor-pointer active:scale-95 transition-all">
                              <span className="material-symbols-outlined">remove</span>
                            </button>
                            <span className="font-bold text-primary text-lg">{qty}</span>
                            <button onClick={() => addToCart(svc)} className="w-10 h-10 flex items-center justify-center text-primary font-bold rounded-lg hover:bg-primary/20 cursor-pointer active:scale-95 transition-all">
                              <span className="material-symbols-outlined">add</span>
                            </button>
                          </div>
                        ) : qty > 0 && isServiceOrEdu ? (
                          <button 
                            onClick={() => removeFromCart(svc)}
                            className="w-full py-3 rounded-xl bg-error/10 hover:bg-error hover:text-white text-error font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                            Remove
                          </button>
                        ) : (
                          <button 
                            onClick={() => addToCart(svc)}
                            className="w-full py-3 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">{catDetails.icon}</span>
                            {catDetails.action}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <section className="liquid-glass p-8 rounded-2xl border border-black/10 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-4">Contact & Support</h3>
            <p className="text-body-md text-on-surface-variant mb-6">Have questions or custom requirements? Send a message directly to the entrepreneur.</p>
            
            <button onClick={() => setShowInquiry(true)} className="w-full btn-bright py-4 rounded-xl font-semibold cursor-pointer mb-3">
              Send Inquiry
            </button>
            
            {business.phone && (
              <a href={`tel:${business.phone}`} className="block w-full text-center border border-black/10 hover:bg-black/5 text-black py-4 rounded-xl font-semibold transition-all shadow-sm mb-3">
                Call {business.phone}
              </a>
            )}
            
            <button onClick={() => setShowReport(true)} className="w-full text-error border-2 border-error/50 hover:border-error hover:bg-error/5 py-3 rounded-xl font-semibold cursor-pointer transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">flag</span> Report Business
            </button>
          </section>
        </aside>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 flex justify-center animate-fade-in-up pointer-events-none">
          <div className="bg-surface border border-outline-variant shadow-2xl rounded-2xl px-6 py-4 flex items-center justify-between gap-6 w-full max-w-2xl pointer-events-auto">
            <div>
              <p className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{totalItems} {totalItems === 1 ? 'Item' : 'Items'} in Cart</p>
              <p className="text-headline-sm font-extrabold text-primary">₹{totalAmount}</p>
            </div>
            <button onClick={() => setShowOrder(true)} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-colors cursor-pointer flex items-center gap-2 active:scale-95">
              <span className="material-symbols-outlined">shopping_cart_checkout</span>
              Checkout
            </button>
          </div>
        </div>
      )}

      {showInquiry && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleInquiry} className="liquid-glass rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl border border-black/10 animate-fade-in-up">
            <h3 className="text-headline-md font-bold">Send Inquiry</h3>
            <input required placeholder="Your name" className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm" value={inquiryForm.customerName} onChange={(e) => setInquiryForm({ ...inquiryForm, customerName: e.target.value })} />
            <input required type="email" placeholder="Email" className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm" value={inquiryForm.customerEmail} onChange={(e) => setInquiryForm({ ...inquiryForm, customerEmail: e.target.value })} />
            <input placeholder="Phone (optional)" className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm" value={inquiryForm.customerPhone} onChange={(e) => setInquiryForm({ ...inquiryForm, customerPhone: e.target.value })} />
            <textarea required rows={4} placeholder="Your message" className="w-full p-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm resize-none" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowInquiry(false)} className="flex-1 py-3 border border-black/10 hover:bg-black/5 text-black rounded-xl cursor-pointer font-semibold transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 btn-bright rounded-xl cursor-pointer font-semibold">Submit</button>
            </div>
          </form>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleReport} className="liquid-glass rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl border border-black/10 animate-fade-in-up">
            <h3 className="text-headline-md font-bold text-error flex items-center gap-2">
              <span className="material-symbols-outlined">flag</span> Report Business
            </h3>
            <p className="text-body-sm text-on-surface-variant">Please let us know why you are reporting this profile.</p>
            
            <select 
              required 
              className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md text-black transition-all shadow-sm" 
              value={reportForm.type} 
              onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
            >
              <option value="Spam">Spam</option>
              <option value="Fraud">Fraud or Scam</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Other">Other</option>
            </select>
            
            <textarea 
              required 
              rows={4} 
              placeholder="Provide more details..." 
              className="w-full p-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm resize-none" 
              value={reportForm.description} 
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })} 
            />
            
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowReport(false)} className="flex-1 py-3 border border-black/10 hover:bg-black/5 text-black rounded-xl cursor-pointer font-semibold transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-error hover:bg-error/90 text-white rounded-xl cursor-pointer font-semibold shadow-md">Submit Report</button>
            </div>
          </form>
        </div>
      )}

      {showOrder && cart.length > 0 && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <form onSubmit={initiatePayment} className="liquid-glass rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl border border-black/10 animate-fade-in-up my-8">
            <h3 className="text-xl font-bold mb-1 text-black">Complete Your Request</h3>
            
            <div className="bg-surface-container rounded-xl p-4 mb-4 border border-black/5 max-h-[30vh] overflow-y-auto">
              <p className="text-sm text-on-surface-variant mb-3 font-semibold border-b pb-2">Order Summary</p>
              <div className="space-y-3">
                {cart.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-on-surface">{c.name}</p>
                      <p className="text-xs text-on-surface-variant">₹{c.price} x {c.quantity}</p>
                    </div>
                    <p className="font-bold">₹{c.price * c.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t mt-4 pt-3">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="font-extrabold text-emerald-600 text-lg">₹{totalAmount}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">{catDetails.addressLabel} *</label>
              <textarea 
                required 
                rows={3} 
                placeholder={`Provide ${catDetails.addressLabel.toLowerCase()} details`} 
                className="w-full p-3 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-sm placeholder:text-gray-400 text-black transition-all shadow-sm resize-none" 
                value={orderForm.deliveryAddress} 
                onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Contact Number *</label>
              <input 
                required 
                type="tel" 
                placeholder="e.g. +91 9876543210" 
                className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-sm placeholder:text-gray-400 text-black transition-all shadow-sm" 
                value={orderForm.contactNumber} 
                onChange={(e) => setOrderForm({ ...orderForm, contactNumber: e.target.value })} 
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setShowOrder(false)} className="flex-1 py-3 border border-black/10 hover:bg-black/5 text-black rounded-xl cursor-pointer font-semibold transition-all">Back to Menu</button>
              <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                {catDetails.actionPrefix} ₹{totalAmount}
              </button>
            </div>
          </form>
        </div>
      )}

      {showPayment && (
        <PaymentModal 
          amount={totalAmount} 
          onPaymentSuccess={handleOrder}
          onCancel={() => {
            setShowPayment(false);
            setShowOrder(true); // Go back to order form
          }}
        />
      )}
    </div>
  );
};

export default BusinessDetail;
