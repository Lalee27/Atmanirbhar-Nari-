import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const LearningSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock settings state
  const [dailyGoal, setDailyGoal] = useState('30');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  const [topics, setTopics] = useState({
    marketing: true,
    finance: false,
    operations: true,
    leadership: false,
  });

  const handleTopicToggle = (topic) => {
    setTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setToastMessage('Learning preferences saved successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-28 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-[1000px] mx-auto animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/learning')}
            className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-black">Learning Preferences</h1>
            <p className="text-sm text-gray-500 mt-1">Customize your learning experience and goals</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="liquid-glass border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-black border-b border-black/5 pb-3 mb-5">Your Interests</h3>
              <p className="text-sm text-gray-500 mb-4">Select the topics you want to see more of in your learning feed.</p>
              
              <div className="flex flex-wrap gap-3">
                {Object.entries(topics).map(([topic, isSelected]) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicToggle(topic)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white text-gray-600 border-black/10 hover:border-black/30'
                    }`}
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="liquid-glass border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-black border-b border-black/5 pb-3 mb-5">Learning Goals</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Daily Study Goal</label>
                  <p className="text-xs text-gray-500 mb-3">How much time do you want to dedicate to learning each day?</p>
                  <select 
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="w-full md:w-1/2 h-11 px-4 bg-white border border-black/10 rounded-xl text-sm outline-none focus:border-black transition-colors"
                  >
                    <option value="15">15 minutes / day</option>
                    <option value="30">30 minutes / day</option>
                    <option value="60">1 hour / day</option>
                    <option value="120">2+ hours / day</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="liquid-glass border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-black border-b border-black/5 pb-3 mb-5">Playback & Notifications</h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-black">Autoplay Videos</p>
                    <p className="text-xs text-gray-500">Automatically play the next video in a course</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-black/5">
                  <div>
                    <p className="text-sm font-bold text-black">Resource Alerts</p>
                    <p className="text-xs text-gray-500">Notify me when new resources match my interests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="h-12 w-full md:w-auto md:px-10 bg-black text-white font-bold text-sm rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span className="material-symbols-outlined text-[18px]">save</span>}
              Save Settings
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-200/50 rounded-full blur-2xl group-hover:bg-emerald-300/50 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                </div>
                <h3 className="font-bold text-emerald-950 mb-2">Why customize?</h3>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  Personalizing your learning preferences helps our AI recommend the most relevant articles, videos, and mentors tailored exactly to your business goals.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="bg-black text-white px-6 py-3 rounded-xl shadow-2xl font-semibold text-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningSettings;
