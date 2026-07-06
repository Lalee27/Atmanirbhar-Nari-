import React from 'react';
import { Scale, Users, Award, ShieldAlert } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen py-12 px-margin-mobile md:px-margin-desktop bg-[#F7F5F0] text-black font-sans relative overflow-hidden">
      <div className="absolute top-[5%] right-[-10%] w-[40%] h-[40%] bg-[#A3A193]/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[800px] mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-3.5 bg-black/5 rounded-full text-black">
            <Scale size={26} />
          </div>
          <h1 className="text-headline-xl text-black font-serif">Terms of Service</h1>
          <p className="text-body-sm text-gray-500 font-medium">Last Updated: May 24, 2026</p>
        </div>

        {/* Content Card */}
        <div className="liquid-glass border border-black/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-8 text-gray-700 leading-relaxed font-sans">
          
          <div className="space-y-4">
            <p className="text-body-lg text-black font-medium leading-relaxed">
              Welcome to Aatmanirbhar Nari! By accessing or using our platform, marketplace directory, and learning systems, you agree to comply with and be bound by the following Terms of Service.
            </p>
          </div>

          <hr className="border-black/5" />

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <Users size={20} className="text-secondary" />
              <h2 className="text-xl font-bold font-sans">1. Account Registration & Conduct</h2>
            </div>
            <p className="text-body-md">
              To utilize marketplace operations, mentor bookings, or courses, you must create a registered account. You are solely responsible for maintaining the confidentiality of your account credentials. You agree that all registered details are true and correct, and you will not impersonate any person or brand.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <Award size={20} className="text-secondary" />
              <h2 className="text-xl font-bold font-sans">2. Marketplace Seller Rules</h2>
            </div>
            <p className="text-body-md">
              Women entrepreneurs listing their homemade products, tailoring apparel, foods, or decor must ensure:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-body-md">
              <li>All listings correspond to legal, safe, and authentic products crafted or sourced ethically.</li>
              <li>Descriptions, images, and prices must accurately depict products.</li>
              <li>You must respond to client inquiries in a timely, professional, and respectful manner.</li>
              <li>You are responsible for shipping, taxes, and customer support for all orders fulfilled outside the platform.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <ShieldAlert size={20} className="text-secondary" />
              <h2 className="text-xl font-bold font-sans">3. Platform Abuse & Termination</h2>
            </div>
            <p className="text-body-md">
              Aatmanirbhar Nari is built on mutual support and respect. We strictly prohibit harassment, abusive behavior, listing counterfeit items, and spamming mentors or buyers. We reserve the absolute right to suspend or terminate accounts that violate these guidelines without prior warning.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black font-sans">4. Intellectual Property</h2>
            <p className="text-body-md">
              All branding, text content, software logic, layouts, and logos are property of Aatmanirbhar Nari. Media and product images uploaded by entrepreneurs remain their exclusive property, but sellers grant the platform a license to display these images on the directory for marketing purposes.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
