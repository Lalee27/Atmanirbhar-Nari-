import React from 'react';
import { useNavigate } from 'react-router-dom';
import mentor1 from '../assets/mentor1.png';
import mentor2 from '../assets/mentor2.png';
import mentor3 from '../assets/mentor3.png';

const MENTORS = [
  {
    id: 1,
    name: 'Anjali Sharma',
    expertise: 'Business Strategy & Scaling',
    experience: '15+ Years',
    image: mentor1,
    rating: 4.9,
    reviews: 124,
    description: 'Anjali specializes in helping women scale their home-based businesses into sustainable enterprises. She provides actionable insights on operational efficiency and market expansion.',
    tags: ['Strategy', 'Scaling', 'Operations'],
  },
  {
    id: 2,
    name: 'Priya Patel',
    expertise: 'Marketing & Brand Building',
    experience: '12+ Years',
    image: mentor2,
    rating: 4.8,
    reviews: 98,
    description: 'A marketing veteran, Priya helps entrepreneurs build strong, authentic brands. She excels at social media strategy, customer engagement, and community building.',
    tags: ['Marketing', 'Branding', 'Social Media'],
  },
  {
    id: 3,
    name: 'Ritu Desai',
    expertise: 'Finance & Legal Basics',
    experience: '10+ Years',
    image: mentor3,
    rating: 4.9,
    reviews: 156,
    description: 'Ritu demystifies finance for new entrepreneurs. From pricing strategies and cash flow management to basic legal compliance, she ensures your business has a solid foundation.',
    tags: ['Finance', 'Legal', 'Pricing'],
  }
];

const Mentors = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in-up !pt-0 -mt-8 md:-mt-12 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-headline-lg font-bold text-on-surface mb-4">
          Connect with <span className="text-gradient-primary">Expert Mentors</span>
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Get personalized guidance from experienced women who have built successful businesses. 
          Learn from their journeys, overcome challenges, and scale your venture with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MENTORS.map((mentor) => (
          <div key={mentor.id} className="standard-card group">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={mentor.image} 
                alt={mentor.name} 
                className="standard-card-img"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                <span className="text-label-md font-semibold text-on-surface">{mentor.rating}</span>
                <span className="text-label-sm text-on-surface-variant">({mentor.reviews})</span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <h3 className="text-headline-sm font-bold text-on-surface">{mentor.name}</h3>
                <p className="text-primary font-semibold mt-1">{mentor.expertise}</p>
                <div className="flex items-center gap-2 mt-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">work_history</span>
                  <span className="text-label-md">{mentor.experience}</span>
                </div>
              </div>
              
              <p className="text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
                {mentor.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-label-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={() => navigate('/book-session/' + mentor.id)}
                className="btn-primary w-full mt-auto"
              >
                <span>Book a Session</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-primary-container rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-headline-md font-bold text-on-primary-container mb-3">Want to become a mentor?</h2>
          <p className="text-body-lg text-on-primary-container/80">
            Share your expertise and empower the next generation of women entrepreneurs. Join our network of successful business leaders.
          </p>
        </div>
        <button 
          onClick={() => navigate('/apply-mentor')}
          className="btn-primary flex-shrink-0"
        >
          Apply as Mentor
        </button>
      </div>
    </div>
  );
};

export default Mentors;
