import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-[1140px] mx-auto liquid-glass border border-black/10 rounded-2xl md:rounded-[2rem] p-8 md:p-20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-black space-y-stack-md">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-black">
              Ready to build your <br />
              own future?
            </h2>
            <p className="font-body-lg text-body-lg text-gray-700 max-w-md">
              Join thousands of women who have turned their passion into a profession. We provide the tools, you provide the talent.
            </p>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <Link
              to="/register"
              className="btn-bright px-8 py-5 rounded-xl font-button-text text-button-text transition-all active:scale-95 text-center"
            >
              Register My Business
            </Link>
            <Link
              to="/apply-mentor"
              className="border-2 border-black text-black px-8 py-5 rounded-xl font-button-text text-button-text hover:bg-black/5 transition-all active:scale-95 text-center"
            >
              Become a Mentor
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32"></div>
      </div>
    </section>
  );
}
