import React, { useState } from 'react';
import { HelpCircle, Shield, CreditCard, ShoppingBag, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUPPORT_CHANNELS = [
  {
    icon: ShoppingBag,
    title: 'Marketplace Support',
    description: 'Help with listing products, updating images, or managing orders.',
  },
  {
    icon: CreditCard,
    title: 'Payments & Payouts',
    description: 'Issues with payment gateways, bank transfers, or billing history.',
  },
  {
    icon: Shield,
    title: 'Account & Safety',
    description: 'Managing profiles, changing passwords, and reporting violations.',
  },
  {
    icon: HelpCircle,
    title: 'General Inquiries',
    description: 'Questions about mentoring sessions, courses, or events.',
  }
];

export default function Support() {
  const [ticket, setTicket] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticket.name && ticket.email && ticket.message) {
      setSubmitted(true);
      setTicket({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen py-12 px-margin-mobile md:px-margin-desktop bg-[#F7F5F0] text-black font-sans relative overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#DEDBC8]/25 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1140px] mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-headline-xl text-black font-serif">How can we help you?</h1>
          <p className="text-body-lg text-gray-600">
            We are dedicated to helping our talented entrepreneurs grow and thrive. Select a channel below or submit a support ticket.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUPPORT_CHANNELS.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <div key={i} className="liquid-glass p-6 rounded-2xl border border-black/5 hover:border-black/10 shadow-md hover:shadow-lg transition-all duration-300 space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-black">{channel.title}</h3>
                <p className="text-body-sm text-gray-500 leading-relaxed">{channel.description}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto liquid-glass border border-black/10 rounded-3xl p-6 md:p-10 shadow-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-normal text-black font-sans">Submit a Support Ticket</h2>
            <p className="text-body-sm text-gray-500">Our dedicated team will get back to you within 24 business hours.</p>
          </div>

          {submitted ? (
            <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center text-center space-y-3 animate-fade-in-up">
              <CheckCircle size={48} className="text-green-600" />
              <h3 className="text-lg font-bold text-green-800">Ticket Submitted Successfully!</h3>
              <p className="text-body-sm text-green-700 max-w-sm">
                Thank you for reaching out. We have received your inquiry and our support team is working on it.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-2 text-label-sm font-bold text-green-800 underline hover:no-underline cursor-pointer"
              >
                Submit another ticket
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
                    value={ticket.name}
                    onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
                    className="w-full bg-white/70 border border-black/10 rounded-xl px-4 py-3 text-body-md outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-label-sm font-bold text-gray-600">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={ticket.email}
                    onChange={(e) => setTicket({ ...ticket, email: e.target.value })}
                    className="w-full bg-white/70 border border-black/10 rounded-xl px-4 py-3 text-body-md outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-label-sm font-bold text-gray-600">Subject (Optional)</label>
                <input
                  id="subject"
                  type="text"
                  value={ticket.subject}
                  onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                  className="w-full bg-white/70 border border-black/10 rounded-xl px-4 py-3 text-body-md outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-label-sm font-bold text-gray-600">Message</label>
                <textarea
                  id="message"
                  required
                  rows="5"
                  value={ticket.message}
                  onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                  className="w-full bg-white/70 border border-black/10 rounded-xl p-4 text-body-md outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 btn-bright py-4 rounded-xl font-button-text text-button-text transition-all active:scale-[0.98] cursor-pointer"
              >
                <Send size={18} />
                Send Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
