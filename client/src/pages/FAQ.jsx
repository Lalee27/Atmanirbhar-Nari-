import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_SECTIONS = [
  {
    title: 'General Questions',
    items: [
      {
        q: 'What is Aatmanirbhar Nari?',
        a: 'Aatmanirbhar Nari is a community platform dedicated to supporting and empowering home-based women entrepreneurs. We provide a digital marketplace to showcase products, educational resources, and a network of experienced business mentors.'
      },
      {
        q: 'Is there any fee to join the community?',
        a: 'No, joining the community, listing products on the basic marketplace directory, and taking general courses in the Learning Hub is completely free. We want to eliminate all barriers to entrepreneurship.'
      }
    ]
  },
  {
    title: 'Marketplace & Orders',
    items: [
      {
        q: 'How do I register my business on the marketplace?',
        a: 'To list your business, create an account, log in, go to your User Profile menu at the top-right, and select "Register a Business". You will be asked to provide your business name, description, category, contact information, and upload high-quality product images.'
      },
      {
        q: 'How do customers contact me to buy products?',
        a: 'Customers can visit your Business Profile on the Marketplace and submit inquiries directly. When an inquiry is submitted, you will receive a notification on your Dashboard, and an email to connect directly with the customer and fulfill the order.'
      }
    ]
  },
  {
    title: 'Mentorship & Learning',
    items: [
      {
        q: 'How does the mentoring system work?',
        a: 'In the "Mentor" section, you can browse experienced professionals who have volunteered to help women entrepreneurs. You can select a mentor based on their expertise (e.g. Legal, Marketing, Finance) and submit a request to book a guidance session.'
      },
      {
        q: 'Who can become a mentor?',
        a: 'Anyone with professional expertise or successful business experience who wants to give back to the community can apply to become a mentor by filling out the mentorship form.'
      }
    ]
  }
];

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleAccordion = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setOpenIndexes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen py-12 px-margin-mobile md:px-margin-desktop bg-[#F7F5F0] text-black font-sans relative overflow-hidden">
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#A3A193]/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[800px] mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-black/5 rounded-full text-black">
            <HelpCircle size={24} />
          </div>
          <h1 className="text-headline-xl text-black font-serif">Frequently Asked Questions</h1>
          <p className="text-body-lg text-gray-600">
            Got questions? We have got answers. Find quick guidance on setting up your store, learning, and mentorship below.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <h2 className="text-xl font-bold tracking-wide text-gray-400 uppercase font-sans border-b border-black/5 pb-2">
                {section.title}
              </h2>
              
              <div className="space-y-3">
                {section.items.map((item, iIdx) => {
                  const isOpen = !!openIndexes[`${sIdx}-${iIdx}`];
                  return (
                    <div 
                      key={iIdx} 
                      className="liquid-glass border border-black/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => toggleAccordion(sIdx, iIdx)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-black/[0.01] transition-colors cursor-pointer group"
                      >
                        <span className="text-lg font-semibold text-black group-hover:text-primary transition-colors leading-snug">
                          {item.q}
                        </span>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-500 transition-transform duration-300 shrink-0 ml-4 ${
                            isOpen ? 'rotate-180 text-black' : ''
                          }`}
                        />
                      </button>

                      <div 
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100 border-t border-black/5' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                      >
                        <p className="p-6 text-body-md text-gray-700 leading-relaxed bg-white/40">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Help CTA banner */}
        <div className="liquid-glass border border-black/10 rounded-3xl p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-black leading-tight">Still have questions?</h3>
            <p className="text-body-sm text-gray-500">No problem! Submit a support ticket and our support specialists will help.</p>
          </div>
          <Link 
            to="/support" 
            className="inline-flex items-center gap-2 btn-bright px-6 py-3.5 rounded-xl font-button-text text-button-text whitespace-nowrap active:scale-95 transition-all"
          >
            <span>Support Portal</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
