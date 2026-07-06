import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuccessStories() {
  return (
    <section className="py-20 overflow-hidden relative z-10">
      <div className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-stack-md">
            <span className="font-label-lg text-label-lg text-gray-500 uppercase tracking-widest">Success Stories</span>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-black">From dreamers to business owners.</h2>
            <p className="font-body-lg text-body-lg text-gray-600">
              Read how women across the country are transforming their skills into sustainable businesses with Aatmanirbhar Nari.
            </p>
            <div className="pt-stack-md">
              <Link to="/stories" className="inline-flex items-center justify-center gap-3 btn-bright px-8 py-4 rounded-lg font-button-text text-button-text transition-all active:scale-95">
                Read All Stories
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Right Story Card */}
          <div className="lg:col-span-7 relative">
            <div className="liquid-glass p-8 rounded-2xl border border-black/10 shadow-xl relative z-10 max-w-md ml-auto">
              <div className="text-5xl mb-4 text-black/10">❝</div>
              <p className="font-body-lg text-body-lg text-black italic leading-relaxed">
                "Starting my tailoring business was daunting until I found this community. The tools and the marketplace helped me reach customers I never thought possible."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black/5 overflow-hidden border-2 border-black/10">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx8GA-Pa8UJJyUofx2zgVe1_9W9xwM_GNBEJvy3kLO5iMkjxXITC65LaN_TSANhSQ0da5oc6LhYEhZAOkAuANuw5EKGe2w4n1wxREpvQUKrLBTNvxQocsQR-j9Wt65S4K0vtOXtJhyPCMPtC0_PHBxUsA9wI4gnrEmolxLZbp_YUl6Wank3EXLe16DZ5RgSL5QEE9QJEEc7TdJ9bvSHaPZWKo3jYISa70YA2p_XgEi2Xbw11tN3kYWSBAnFvoPUy4uogfFaTDNL60"
                    alt="Priya Sharma"
                  />
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-black">Priya Sharma</p>
                  <p className="font-label-md text-label-md text-gray-500">Owner, Priya's Boutique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
