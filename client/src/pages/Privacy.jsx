import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 px-margin-mobile md:px-margin-desktop bg-[#F7F5F0] text-black font-sans relative overflow-hidden">
      <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] bg-[#DEDBC8]/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[800px] mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-3.5 bg-black/5 rounded-full text-black">
            <Shield size={26} />
          </div>
          <h1 className="text-headline-xl text-black font-serif">Privacy Policy</h1>
          <p className="text-body-sm text-gray-500 font-medium">Last Updated: May 24, 2026</p>
        </div>

        {/* Content Card */}
        <div className="liquid-glass border border-black/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-8 text-gray-700 leading-relaxed font-sans">
          
          <div className="space-y-4">
            <p className="text-body-lg text-black font-medium leading-relaxed">
              At Aatmanirbhar Nari, we value your trust and respect your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit and use our community marketplace platform.
            </p>
          </div>

          <hr className="border-black/5" />

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <Eye size={20} className="text-secondary" />
              <h2 className="text-xl font-bold font-sans">1. Information We Collect</h2>
            </div>
            <p className="text-body-md">
              We collect information to provide better services and a seamless user experience to our community:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-body-md">
              <li><strong>Account Information:</strong> When you register as a user, entrepreneur, or mentor, we collect your name, email address, password, phone number, and location details.</li>
              <li><strong>Business & Listing Profiles:</strong> If you register a store, we collect product descriptions, store names, contact information, price points, and upload media files.</li>
              <li><strong>Communication Records:</strong> We collect details of inquiries, chat messages, and tickets sent to support or shared between buyers and sellers.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <FileText size={20} className="text-secondary" />
              <h2 className="text-xl font-bold font-sans">2. How We Use Your Information</h2>
            </div>
            <p className="text-body-md">
              The information we gather is used for the following operational and developmental purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-body-md">
              <li>To set up and manage user accounts and online storefronts.</li>
              <li>To facilitate seamless communication and inquiries between buyers and women entrepreneurs.</li>
              <li>To personalize and improve learning content, tutoring recommendations, and mentorship bookings.</li>
              <li>To analyze platform security, monitor for fraud, and maintain compliance.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <Lock size={20} className="text-secondary" />
              <h2 className="text-xl font-bold font-sans">3. Data Security & Storage</h2>
            </div>
            <p className="text-body-md">
              We employ standard encryption algorithms and securely host data via cloud databases with active monitoring tools. Your password details are strongly hashed using bcrypt algorithm and are completely invisible. While we protect your profile data, no method of transmission is 100% secure, and we advise caution with sharing private credentials.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black font-sans">4. Contacting Us About Privacy</h2>
            <p className="text-body-md">
              If you have any questions, concerns, or requests regarding your personal information, or if you would like to permanently delete your profile database record, please email us directly at <span className="font-bold text-black">privacy@aatmanirbharnari.in</span>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
