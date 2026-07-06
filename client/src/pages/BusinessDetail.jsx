import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBusinessById, submitInquiry, resolveImageUrl } from '../services/api';
import ServiceMediaGallery from '../components/ServiceMediaGallery';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
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
      await submitInquiry({ businessId: id, ...form });
      setSubmitMsg('Inquiry sent! The entrepreneur will contact you soon.');
      setShowInquiry(false);
      setForm({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
    } catch {
      setSubmitMsg('Failed to send inquiry. Please try again.');
    }
  };

  if (loading) {
    return <p className="text-center py-24 text-on-surface-variant">Loading business...</p>;
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
  const pricing =
    business.services?.length > 0
      ? `₹${Math.min(...business.services.map((s) => s.price))} – ₹${Math.max(...business.services.map((s) => s.price))}`
      : 'Contact for quote';
  const today = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
  const hours = business.availability?.[today] || 'See profile';

  return (
    <div className="max-w-[1140px] mx-auto px-5 md:px-16 py-8 space-y-8 pb-24">
      <Link to="/marketplace" className="text-secondary flex items-center gap-2 hover:underline font-semibold">
        <span className="material-symbols-outlined">arrow_back</span> Back to Marketplace
      </Link>

      {submitMsg && <p className="p-4 bg-secondary-container rounded-lg text-on-secondary-container">{submitMsg}</p>}

      <section className="mb-8">
        <div className="relative h-[400px] rounded-xl overflow-hidden border border-outline-variant">
          <img className="w-full h-full object-cover" src={business.images?.[0] ? resolveImageUrl(business.images[0]) : 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=1000'} alt={business.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-8 text-white">
            <h1 className="text-headline-lg font-bold">{business.name}</h1>
            <div className="flex items-center gap-2 text-label-lg">
              <span className="material-symbols-outlined">location_on</span>
              {location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="liquid-glass p-6 rounded-xl border border-black/5 flex items-center gap-4 shadow-sm">
            <span className="material-symbols-outlined text-secondary">schedule</span>
            <div>
              <p className="text-label-md text-on-surface-variant">Today</p>
              <p className="font-bold">{hours}</p>
            </div>
          </div>
          <div className="liquid-glass p-6 rounded-xl border border-black/5 flex items-center gap-4 shadow-sm">
            <span className="material-symbols-outlined text-secondary">payments</span>
            <div>
              <p className="text-label-md text-on-surface-variant">Pricing</p>
              <p className="font-bold">{pricing}</p>
            </div>
          </div>
          <div className="liquid-glass p-6 rounded-xl border border-black/5 flex items-center gap-4 shadow-sm">
            <span className="material-symbols-outlined text-primary">star</span>
            <div>
              <p className="text-label-md text-on-surface-variant">Rating</p>
              <p className="font-bold">{business.rating && business.rating > 0 ? `${business.rating} (${business.reviewCount || 0} reviews)` : 'New'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-8 rounded-lg border shadow-sm">
            <h2 className="text-headline-md text-primary font-bold mb-4">About</h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">{business.description}</p>
          </section>
          <ServiceMediaGallery images={business.images} />
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <section className="liquid-glass p-8 rounded-2xl border border-black/10 shadow-md">
            <h3 className="text-headline-md font-semibold mb-4">Services</h3>
            <ul className="space-y-3 mb-6">
              {(business.services || []).map((s, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-body-md">{s.name}</span>
                  <span className="font-bold text-primary">₹{s.price}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowInquiry(true)} className="w-full btn-bright py-4 rounded-xl font-semibold cursor-pointer mb-3">
              Send Inquiry
            </button>
            {business.phone && (
              <a href={`tel:${business.phone}`} className="block w-full text-center border border-black/10 hover:bg-black/5 text-black py-4 rounded-xl font-semibold transition-all shadow-sm animate-fade-in-up">
                Call {business.phone}
              </a>
            )}
          </section>
          {business.isVerified && (
            <span className="inline-flex items-center gap-1 bg-tertiary-container px-4 py-2 rounded-full text-label-md font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span> Verified Business
            </span>
          )}
        </aside>
      </div>

      {showInquiry && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleInquiry} className="liquid-glass rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl border border-black/10 animate-fade-in-up">
            <h3 className="text-headline-md font-bold">Send Inquiry</h3>
            <input required placeholder="Your name" className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            <input required type="email" placeholder="Email" className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            <input placeholder="Phone (optional)" className="w-full h-11 px-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
            <textarea required rows={4} placeholder="Your message" className="w-full p-4 rounded-xl border border-black/10 focus:border-black/30 outline-none liquid-glass text-body-md placeholder:text-gray-400 text-black transition-all shadow-sm resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowInquiry(false)} className="flex-1 py-3 border border-black/10 hover:bg-black/5 text-black rounded-xl cursor-pointer font-semibold transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 btn-bright rounded-xl cursor-pointer font-semibold">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BusinessDetail;
