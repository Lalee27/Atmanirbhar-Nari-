import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 98765 43210',
    description: 'Mon - Fri, 9:00 AM - 6:00 PM IST',
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@aatmanirbharnari.in',
    description: 'Send us your inquiries anytime!',
  },
  {
    icon: MapPin,
    title: 'Our Center',
    value: 'Plot 42, Sector 15, Dwarka, New Delhi',
    description: '110075, India',
  }
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', businessName: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSuccess(true);
      setForm({ name: '', email: '', businessName: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen py-12 px-margin-mobile md:px-margin-desktop bg-[#F7F5F0] text-black font-sans relative overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#DEDBC8]/25 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1140px] mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-headline-xl text-black font-serif">Contact Our Team</h1>
          <p className="text-body-lg text-gray-600">
            Have questions about registrations, partnership opportunities, or corporate sponsorships? Fill out the form or reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-6">
              {CONTACT_INFO.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="liquid-glass p-6 rounded-2xl border border-black/5 flex items-start gap-5 shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-label-sm font-bold text-gray-400 uppercase tracking-widest">{item.title}</h3>
                      <p className="text-lg font-bold text-black">{item.value}</p>
                      <p className="text-body-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Availability details card */}
            <div className="p-6 bg-white/40 border border-black/5 rounded-2xl flex gap-4 items-center">
              <Clock className="text-secondary shrink-0" size={24} />
              <div className="min-w-0">
                <p className="text-label-sm font-bold text-gray-600">Response Guarantee</p>
                <p className="text-body-sm text-gray-500">We respond to all email messages within 1 business day.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7 liquid-glass border border-black/10 rounded-3xl p-6 md:p-10 shadow-xl space-y-6">
            <h2 className="text-2xl font-normal text-black font-sans">Send Us a Message</h2>

            {success ? (
              <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center text-center space-y-3 animate-fade-in-up">
                <CheckCircle size={48} className="text-green-600" />
                <h3 className="text-lg font-bold text-green-800">Message Sent Successfully!</h3>
                <p className="text-body-sm text-green-700 max-w-sm">
                  Your message has been delivered. A support representative or program coordinator will reach out to you shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-label-sm font-bold text-green-800 underline hover:no-underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-label-sm font-bold text-gray-600">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/70 border border-black/10 rounded-xl px-4 py-3 text-body-md outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-label-sm font-bold text-gray-600">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/70 border border-black/10 rounded-xl px-4 py-3 text-body-md outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="business" className="text-label-sm font-bold text-gray-600">Business Name (Optional)</label>
                  <input
                    id="business"
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full bg-white/70 border border-black/10 rounded-xl px-4 py-3 text-body-md outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-label-sm font-bold text-gray-600">Your Message</label>
                  <textarea
                    id="message"
                    required
                    rows="5"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/70 border border-black/10 rounded-xl p-4 text-body-md outline-none focus:border-black transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 btn-bright py-4 rounded-xl font-button-text text-button-text transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Send size={18} />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
