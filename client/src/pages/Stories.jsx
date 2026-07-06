import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Quote, Sparkles, TrendingUp, Award, Users, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_STORIES = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: "Owner, Priya's Boutique",
    category: 'Apparel',
    tag: 'Fashion & Apparel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx8GA-Pa8UJJyUofx2zgVe1_9W9xwM_GNBEJvy3kLO5iMkjxXITC65LaN_TSANhSQ0da5oc6LhYEhZAOkAuANuw5EKGe2w4n1wxREpvQUKrLBTNvxQocsQR-j9Wt65S4K0vtOXtJhyPCMPtC0_PHBxUsA9wI4gnrEmolxLZbp_YUl6Wank3EXLe16DZ5RgSL5QEE9QJEEc7TdJ9bvSHaPZWKo3jYISa70YA2p_XgEi2Xbw11tN3kYWSBAnFvoPUy4uogfFaTDNL60',
    quote: "Starting my tailoring business was daunting until I found this community. The tools and the marketplace helped me reach customers I never thought possible.",
    stats: {
      growth: '5x Revenue Increase',
      impact: 'Employs 4 local women',
      milestone: '150+ Happy Clients',
    },
    narrative: [
      "Priya started her journey with nothing but a single manual sewing machine in a small corner of her living room. With a deep passion for tailoring and Indian ethnic wear, she wanted to establish her own brand, but lacked the resources and business knowledge to reach customers beyond her neighborhood.",
      "Everything changed when she registered her business on Aatmanirbhar Nari. She participated in interactive mentorship programs, where veteran designers helped her refine her collection and taught her the basics of product pricing and packaging.",
      "By showcasing her boutique designs on the Aatmanirbhar Nari Marketplace, she unlocked an entirely new digital customer base. Within one year, her orders surged by 500%, enabling her to purchase industrial sewing machines and hire four other women from her locality, empowering them with stable livelihoods."
    ]
  },
  {
    id: 2,
    name: 'Kiran Devi',
    role: 'Founder, Organic Clay Crafts',
    category: 'Handicrafts',
    tag: 'Handicrafts & Decor',
    image: '/pottery_artisan.png',
    quote: "I only knew how to shape clay, not how to shape a business. This platform gave my traditional craft a national stage and changed my family's destiny.",
    stats: {
      growth: '300% Income Growth',
      impact: 'Preserving Heritage Art',
      milestone: '3000+ Terracotta Products Sold',
    },
    narrative: [
      "Kiran Devi is a traditional terracotta artisan from a rural block in Rajasthan. For generations, her family had made beautiful earthen lamps, pots, and wall hangings, selling them only in local village fairs for very nominal prices.",
      "The digital gap made it impossible for her to access urban markets where traditional handicrafts are highly valued. Through the digital literacy programs in the Aatmanirbhar Nari Learning Hub, Kiran learned how to take high-quality photos of her products using a smartphone and list them online.",
      "Today, her exquisitely hand-painted terracotta kitchenware and lamps are shipped across metropolitan cities. She has increased her family income threefold and has trained twelve young girls in her village, preserving a fading traditional heritage while establishing economic self-reliance."
    ]
  },
  {
    id: 3,
    name: 'Meenakshi Iyer',
    role: "Founder, Nani's Secret Spices",
    category: 'Culinary',
    tag: 'Food & Culinary',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600',
    quote: "With heirloom recipes and community guidance on safety certifications, my home-ground spices are now a registered brand.",
    stats: {
      growth: '1000+ Orders Fulfilled',
      impact: '100% Homemade & Pure',
      milestone: 'FSSAI Certified Venture',
    },
    narrative: [
      "Meenakshi possessed her grandmother's handwritten notebook of secret spice blend recipes, famous in her extended family for their rich flavor and authenticity. She dreamed of sharing these pure, preservative-free masalas with home cooks everywhere.",
      "However, launching a food business required navigating complex safety licenses, shelf-life tests, and commercial packaging. On Aatmanirbhar Nari, she connected with food safety mentors who walked her step-by-step through obtaining an FSSAI registration.",
      "She used the marketplace feedback to refine her packaging, making it premium and eco-friendly. Now operating out of a certified home-kitchen facility, 'Nani's Secret Spices' has fulfilled over 1,000 orders and is a household favorite, proving that homemakers can successfully lead culinary enterprises."
    ]
  },
  {
    id: 4,
    name: 'Savita Patil',
    role: 'Founder, Patil Educational Center',
    category: 'Education',
    tag: 'Education & Services',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600',
    quote: "True empowerment starts with knowledge. We started with two students, and now we train eighty girls in digital literacy and basic coding.",
    stats: {
      growth: '80+ Active Students',
      impact: 'Bridging Digital Divide',
      milestone: 'Launched free coding club',
    },
    narrative: [
      "Savita Patil, a college graduate, saw a worrying trend in her neighborhood: young girls were dropping out of school early or lagging behind due to a lack of tutoring and computer access. She decided to offer tutoring services from her home veranda.",
      "To scale her vision, she needed a business structure and funds for digital equipment. Through the community forum on Aatmanirbhar Nari, she was paired with retired academic mentors who helped her outline a sustainable fee-structure and a community-support model.",
      "She registered her center as a services micro-business. Today, Patil Educational Center operates out of a rented multi-room facility, equipped with computers donated by community members. The center provides curriculum coaching and digital literacy programs, lighting a path of academic success for young girls."
    ]
  }
];

const CATEGORIES = ['All', 'Apparel', 'Handicrafts', 'Culinary', 'Education'];

export default function Stories() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStory, setSelectedStory] = useState(null);

  const filteredStories = selectedCategory === 'All'
    ? ALL_STORIES
    : ALL_STORIES.filter(story => story.category === selectedCategory);

  return (
    <div className="min-h-screen py-10 px-margin-mobile md:px-margin-desktop bg-[#F7F5F0] text-black font-sans relative overflow-hidden">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#DEDBC8]/30 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-[#A3A193]/20 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1140px] mx-auto relative z-10 space-y-12">
        
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-label-md font-semibold">Back to Home</span>
          </Link>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
              <Sparkles size={14} className="text-secondary" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-secondary">Inspiring Journeys</span>
            </div>
            <h1 className="text-headline-xl text-black font-serif">
              Stories of Grit, Passion & <br className="hidden md:inline" /> Independence
            </h1>
            <p className="text-body-lg text-gray-600 max-w-2xl">
              Meet the incredible women who have transformed their traditional skills, culinary secrets, and creative talents into thriving, sustainable enterprises.
            </p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex gap-2 pb-4 overflow-x-auto hide-scrollbar border-b border-black/5">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-toggle ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStories.map((story) => (
            <div 
              key={story.id} 
              className="liquid-glass rounded-3xl border border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div className="w-full h-64 overflow-hidden relative rounded-t-3xl bg-black/5">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-black/5 text-[11px] uppercase font-bold tracking-wider text-black">
                  {story.tag}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-normal text-black font-sans leading-tight">{story.name}</h3>
                    <p className="text-body-sm text-gray-500 font-medium">{story.role}</p>
                  </div>
                  
                  {/* Quote block */}
                  <div className="bg-black/[0.02] p-4 rounded-xl border border-black/[0.03] relative">
                    <Quote size={20} className="text-black/10 absolute top-3 left-3" />
                    <p className="text-body-md text-gray-700 italic pl-6 leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>
                </div>

                {/* Stats Summary list */}
                <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-black/5 rounded-lg text-black shrink-0">
                      <TrendingUp size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Growth</p>
                      <p className="text-label-md font-semibold text-black truncate">{story.stats.growth}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-black/5 rounded-lg text-black shrink-0">
                      <Users size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Impact</p>
                      <p className="text-label-md font-semibold text-black truncate">{story.stats.impact}</p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedStory(story)}
                  className="w-full flex items-center justify-between p-3.5 bg-black/5 hover:bg-black hover:text-white rounded-2xl text-black font-semibold text-label-lg transition-all duration-300 cursor-pointer group/btn active:scale-[0.98]"
                >
                  <span>Read Her Journey</span>
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail Dialog */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setSelectedStory(null)}
            />

            {/* Modal Body */}
            <div className="bg-[#F7F5F0] border border-black/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto p-6 md:p-10 animate-fade-in-up flex flex-col space-y-6">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black hover:text-white rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Dialog Content */}
              <div className="space-y-6">
                
                {/* Header Card */}
                <div className="flex items-center gap-5 pb-6 border-b border-black/5">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black/10 bg-black/5 shrink-0">
                    <img 
                      src={selectedStory.image} 
                      alt={selectedStory.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-black/5 rounded-full text-gray-600 inline-block mb-1.5">
                      {selectedStory.tag}
                    </span>
                    <h2 className="text-3xl font-normal text-black font-sans leading-tight">{selectedStory.name}</h2>
                    <p className="text-body-sm text-gray-500 font-medium">{selectedStory.role}</p>
                  </div>
                </div>

                {/* Milestone details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/70 border border-black/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-black mb-1">
                      <TrendingUp size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Revenue Growth</span>
                    </div>
                    <p className="text-body-md font-bold text-black">{selectedStory.stats.growth}</p>
                  </div>
                  
                  <div className="p-4 bg-white/70 border border-black/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-black mb-1">
                      <Users size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Local Impact</span>
                    </div>
                    <p className="text-body-md font-bold text-black">{selectedStory.stats.impact}</p>
                  </div>

                  <div className="p-4 bg-white/70 border border-black/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-black mb-1">
                      <Award size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Key Milestone</span>
                    </div>
                    <p className="text-body-md font-bold text-black">{selectedStory.stats.milestone}</p>
                  </div>
                </div>

                {/* Narrative blocks */}
                <div className="space-y-4 text-body-lg text-gray-700 leading-relaxed font-sans">
                  <div className="font-serif text-2xl text-black italic font-normal py-2 border-l-4 border-black pl-4 my-4 bg-black/[0.01]">
                    "{selectedStory.quote}"
                  </div>
                  {selectedStory.narrative.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Closing CTA */}
                <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                  <span className="text-body-sm text-gray-500 font-medium">Inspired by her journey?</span>
                  <Link
                    to="/marketplace"
                    onClick={() => setSelectedStory(null)}
                    className="btn-bright px-6 py-3 rounded-xl font-button-text text-button-text flex items-center gap-2"
                  >
                    <BookOpen size={16} />
                    Visit Marketplace
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
