import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LearningHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('All Resources');
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [workshopStatus, setWorkshopStatus] = useState(null); // null, 'registered', 'info'

  const categories = ['All', 'Tailoring', 'Tiffin Services', 'Handicrafts'];

  const trendingTopics = [
    { title: 'GST for Small Business', tag: 'Compliance' },
    { title: 'Social Media Marketing', tag: 'Marketing' },
    { title: 'Micro-loans 101', tag: 'Financial Literacy' }
  ];

  const modules = [
    {
      id: 1,
      title: 'Pricing Your Products',
      category: 'Financial Literacy',
      desc: 'Learn how to calculate costs, overheads, and profit margins to ensure your business stays sustainable and grows.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
      actionText: 'Watch Video',
      icon: 'play_circle',
      pills: ['Financial Literacy', 'Tiffin Services', 'Handicrafts'],
      videoUrl: 'https://www.youtube.com/embed/6eWnOmP3_Kk?start=65'
    },
    {
      id: 2,
      title: 'Business Registration',
      category: 'Compliance',
      desc: 'A step-by-step guide to MSME registration, GST, and local trade licenses required for women entrepreneurs in India.',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800',
      actionText: 'Watch Video',
      icon: 'play_circle',
      pills: ['Compliance', 'Tailoring', 'Tiffin Services', 'Handicrafts'],
      videoUrl: 'https://www.youtube.com/embed/1k_07yksTYU'
    },
    {
      id: 3,
      title: 'Digital Marketing Basics',
      category: 'Marketing',
      desc: 'How to use WhatsApp and Instagram to find new customers and build a community around your brand.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
      actionText: 'Watch Video',
      icon: 'play_circle',
      pills: ['Marketing', 'Tailoring', 'Tiffin Services', 'Handicrafts'],
      videoUrl: 'https://www.youtube.com/embed/INPXyUdIzW4'
    },
    {
      id: 4,
      title: 'Inventory Management',
      category: 'Operations',
      desc: 'Simple tools and methods to track your stock levels and never miss a customer order.',
      image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&q=80&w=800',
      actionText: 'Watch Video',
      icon: 'play_circle',
      pills: ['Operations', 'Handicrafts'],
      videoUrl: 'https://www.youtube.com/embed/yl-e10EEspQ'
    }
  ];

  // Sync bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedModules');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        setBookmarks([]);
      }
    }
  }, []);

  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((bId) => bId !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem('bookmarkedModules', JSON.stringify(updated));
  };

  // Filtering logic
  const filteredModules = modules.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || mod.pills.includes(selectedCategory);

    const matchesTrending = activeTab === 'Trending Topics' 
      ? trendingTopics.some(topic => mod.pills.includes(topic.tag) || mod.title.toLowerCase().includes(topic.title.toLowerCase()))
      : true;

    const matchesSaved = activeTab === 'Saved Resources'
      ? bookmarks.includes(mod.id)
      : true;

    return matchesSearch && matchesCategory && matchesTrending && matchesSaved;
  });

  return (
    <div className="max-w-[1140px] mx-auto px-5 md:px-16 py-8 flex flex-col md:flex-row gap-8">
      {/* SideNavBar (Resources/Trending) */}
      <aside className="w-full md:w-64 gap-6 shrink-0 flex flex-col">
        <div>
          <h2 className="text-headline-md text-primary mb-1">Learning Hub</h2>
          <p className="text-label-lg text-on-surface-variant">Resources for Growth</p>
          <Link to="/mentor" className="mt-3 inline-flex items-center gap-2 text-label-md text-secondary font-semibold hover:underline">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            Try AI Business Mentor
          </Link>
        </div>
        <nav className="flex flex-col gap-2">
          {[
            { name: 'All Resources', icon: 'library_books' },
            { name: 'Saved Resources', icon: 'bookmark' },
            { name: 'Trending Topics', icon: 'trending_up' },
            { name: 'Inquiries', icon: 'chat_bubble', path: '/inquiries' },
            { name: 'Settings', icon: 'settings', path: '/learning/settings' }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                if (tab.path) {
                  navigate(tab.path);
                }
              }}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 active:scale-98 transition-all text-left cursor-pointer ${
                activeTab === tab.name
                  ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              <span className="text-label-lg">{tab.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 liquid-glass rounded-xl border border-black/5">
          <h3 className="text-label-lg text-primary mb-3">Trending Now</h3>
          <ul className="space-y-3">
            {trendingTopics.map((topic, idx) => (
              <li
                key={idx}
                onClick={() => setSearchQuery(topic.title)}
                className="flex items-center gap-2 text-on-surface-variant text-label-md hover:text-primary cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">sell</span>
                {topic.title}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 liquid-glass border border-black/10 rounded-xl focus:border-black/30 focus:ring-0 text-body-md transition-all outline-none placeholder:text-gray-400 text-black"
              placeholder="Search resources (e.g., Marketing, Licenses)"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-toggle ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'All' ? 'Show All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loop over modules */}
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="liquid-glass border border-black/5 rounded-xl overflow-hidden flex flex-col group hover:border-black/15 transition-colors card-hover"
            >
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  alt={mod.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={mod.image}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-terracotta-clay text-label-md font-semibold uppercase tracking-wider">{mod.category}</span>
                    <button
                      onClick={() => toggleBookmark(mod.id)}
                      className="text-outline cursor-pointer hover:text-primary active:scale-90 transition-transform"
                    >
                      <span className={`material-symbols-outlined ${bookmarks.includes(mod.id) ? 'text-primary fill-current' : ''}`}>
                        {bookmarks.includes(mod.id) ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>
                  <h3 className="text-headline-md mb-2 text-on-surface font-semibold">{mod.title}</h3>
                  <p className="text-on-surface-variant text-body-md mb-4 leading-relaxed line-clamp-3">{mod.desc}</p>
                </div>
                <button
                  onClick={() => setSelectedModule(mod)}
                  className="w-full py-3 bg-white text-black border border-black/10 text-button-text rounded-lg hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer btn-hover-lift font-semibold"
                >
                  {mod.actionText}
                  <span className="material-symbols-outlined text-[20px]">{mod.icon}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Featured Card (Spans 2 columns) */}
          <div className="md:col-span-2 liquid-glass border border-black/10 rounded-xl p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm relative overflow-hidden">
            <div className="flex-1">
              <span className="bg-black/5 border border-black/10 text-black px-3 py-1 rounded-full text-label-md font-bold mb-4 inline-block">
                RECORDED WORKSHOP
              </span>
              <h2 className="text-headline-lg text-black mb-4 font-bold">Mastering the Art of Sales</h2>
              <p className="text-gray-600 text-body-md mb-6 opacity-90 leading-relaxed">
                Watch our recorded live session with industry experts to learn negotiation skills and customer relationship management tailored for small business owners.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setWorkshopStatus('video')}
                  className="px-6 py-3 btn-bright text-button-text rounded-lg active:scale-95 transition-all cursor-pointer font-semibold shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">play_circle</span>
                  Watch Recording
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-[16/9] md:aspect-[3/4] rounded-xl bg-black/5 flex items-center justify-center overflow-hidden border border-black/10 flex-shrink-0">
              <img
                alt="Workshop Group"
                className="w-full h-full object-cover animate-pulse-subtle"
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
              />
            </div>
          </div>
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12 liquid-glass rounded-xl border border-black/5">
            <span className="material-symbols-outlined text-outline text-5xl mb-3">search_off</span>
            <p className="text-body-lg text-on-surface-variant font-semibold">No resources found matching "{searchQuery}"</p>
            <p className="text-body-sm text-outline mt-1">Try searching for other terms or click on categories above.</p>
          </div>
        )}
      </main>

      {/* Module Syllabus & Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-outline-variant max-w-lg w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-fade-in-up">
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <span className="text-terracotta-clay text-label-md font-bold uppercase tracking-wider block mb-2">{selectedModule.category}</span>
            <h3 className="text-headline-lg font-bold text-on-surface mb-3">{selectedModule.title}</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed mb-6">{selectedModule.desc}</p>

            <div className="bg-surface-container-low p-4 rounded-xl mb-6">
              <h4 className="font-bold text-label-lg text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">menu_book</span> Module Syllabus & Guide
              </h4>
              <ul className="space-y-2 text-label-md text-on-surface-variant mb-4">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  Introduction to {selectedModule.title}
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  Best-practices and planning strategies
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-outline">radio_button_unchecked</span>
                  Interactive Case Study & Live Assessment
                </li>
              </ul>
              
              {selectedModule.videoUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-black/10 aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedModule.videoUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedModule(null)}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-label-lg font-semibold active:scale-95 transition-all cursor-pointer hover:bg-surface-container-low"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Accessing resources for "${selectedModule.title}"! Preparing course material...`);
                  setSelectedModule(null);
                }}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-label-lg font-semibold active:scale-95 transition-all cursor-pointer hover:opacity-90 shadow-md animate-pulse-subtle"
              >
                Launch Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Registration Modal */}
      {workshopStatus && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-outline-variant max-w-md w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-fade-in-up">
            <button
              onClick={() => setWorkshopStatus(null)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {workshopStatus === 'video' ? (
              <div className="space-y-4">
                <h3 className="text-headline-md font-bold text-on-surface">Mastering the Art of Sales</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  Recorded Workshop Session.
                </p>
                <div className="mt-4 rounded-lg overflow-hidden border border-black/10 aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/xkkIpd8MUA4" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : workshopStatus === 'registered' ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">
                  🎉
                </div>
                <h3 className="text-headline-md font-bold text-on-surface">You're Registered!</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  Successfully registered for the <strong>"Mastering the Art of Sales"</strong> live session. We have automatically sent your calendar invite and Zoom link to your registered email address.
                </p>
                <button
                  onClick={() => setWorkshopStatus(null)}
                  className="w-full mt-4 py-3 bg-primary text-white rounded-xl text-label-lg font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  Great, Thanks!
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-md font-bold inline-block">
                  Live Event Details
                </span>
                <h3 className="text-headline-md font-bold text-on-surface">Mastering the Art of Sales</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  Join Priya Sharma (Founder of Priya's Boutique) and business growth mentors for an intensive 2-hour interactive workshop.
                </p>
                <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-label-md text-on-surface-variant">
                  <p><strong>📅 Date:</strong> Saturday, June 6, 2026</p>
                  <p><strong>⏰ Time:</strong> 10:00 AM – 12:00 PM IST</p>
                  <p><strong>📍 Platform:</strong> Live interactive Zoom webinar</p>
                  <p><strong>🎯 Key Takeaways:</strong> Pricing strategies, social negotiation tactics, and client retention.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setWorkshopStatus(null)}
                    className="flex-1 py-3 border border-outline-variant rounded-xl text-label-lg font-semibold active:scale-95 transition-all cursor-pointer hover:bg-surface-container-low"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setWorkshopStatus('registered')}
                    className="flex-1 py-3 bg-primary text-white rounded-xl text-label-lg font-semibold active:scale-95 transition-all cursor-pointer hover:opacity-90 shadow-md"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHub;
