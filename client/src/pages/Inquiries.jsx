import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { updateInquiryStatus, getMyInquiries, getMyBusiness } from '../services/api';

const Inquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selected, setSelected] = useState(null);

  let userInfo = {};
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  } catch (e) {
    userInfo = {};
  }

  const userName = userInfo?.name?.split(' ')[0] || 'Entrepreneur';

  const fetchInquiries = async (showToastOnIncrease = false) => {
    try {
      const { data } = await getMyInquiries();
      setInquiries((prev) => {
        const prevNewCount = prev.filter((i) => i.status === 'new').length;
        const inquiriesList = data.inquiries || [];
        const currentNewCount = inquiriesList.filter((i) => i.status === 'new').length;
        if (showToastOnIncrease && currentNewCount > prevNewCount) {
          setToastMessage('New inquiry received! 🔔');
          setTimeout(() => setToastMessage(''), 4500);
        }
        return inquiriesList;
      });
    } catch {
      setInquiries([]);
    }
  };

  const fetchBusiness = async () => {
    try {
      const { data } = await getMyBusiness();
      setBusiness(data);
    } catch {
      setBusiness(null);
    }
  };

  useEffect(() => {
    if (!userInfo.token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    Promise.all([
      fetchInquiries(false),
      fetchBusiness(),
    ]).finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetchInquiries(true);
      fetchBusiness();
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate, userInfo.token]);

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  const handleStatus = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
      setSelected((prev) => (prev?._id === id ? { ...prev, status } : prev));
      setToastMessage(`Inquiry marked as ${status}`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch {
      /* ignore */
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const diff = (Date.now() - d) / 3600000;
    if (diff < 24) return `${Math.floor(diff)}h ago`;
    if (diff < 48) return 'Yesterday';
    return `${Math.floor(diff / 24)} days ago`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const avatarColors = [
    'bg-rose-500 text-white',
    'bg-blue-500 text-white',
    'bg-emerald-500 text-white',
    'bg-purple-500 text-white',
    'bg-amber-500 text-white',
  ];

  const getAvatarColor = (name) => {
    const code = name ? name.charCodeAt(0) : 0;
    return avatarColors[code % avatarColors.length];
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">New</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">Contacted</span>;
      case 'closed':
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-gray-500/10 text-gray-600 border border-gray-500/20">Closed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 lg:px-8 py-8 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-white border border-black/10 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-fade-in-up">
          <span className="material-symbols-outlined text-amber-600 text-[24px]">notifications_active</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 hover:opacity-85 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      <div className="space-y-8 animate-fade-in-up">
        {/* Welcome Banner Card */}
        <div className="relative border border-black/5 p-6 md:p-10 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md overflow-hidden min-h-[220px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: "url('/dashboard_banner.png')" }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />

          <div className="space-y-2.5 relative z-20">
            <div className="flex items-center flex-wrap gap-3">
              <h1 className="text-3xl md:text-4xl text-white font-serif tracking-tight drop-shadow-md">
                Welcome back, {userName}
              </h1>
              {business && (
                <span className="px-3 py-1 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm backdrop-blur-md">
                  Active Member
                </span>
              )}
            </div>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-xl font-medium drop-shadow-md">
              {business 
                ? `Here are your recent inquiries. Keep building your dreams.`
                : 'Complete your business profile to get listed on the marketplace and receive customer leads.'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="relative z-20 px-6 h-12 bg-white text-black font-bold text-sm rounded-xl cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            Edit Profile
          </button>
        </div>

        {/* Metric Grid Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: 'Profile Strength', value: '85%', change: '+5% this week', icon: 'trending_up', 
              iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-700', badgeBg: 'bg-emerald-500/10', badgeColor: 'text-emerald-700', badgeBorder: 'border-emerald-500/20' 
            },
            { 
              label: 'New Inquiries', value: newCount, change: 'Pending Action', icon: 'forum', 
              iconBg: 'bg-amber-500/10', iconColor: 'text-amber-700', badgeBg: 'bg-amber-500/10', badgeColor: 'text-amber-700', badgeBorder: 'border-amber-500/20' 
            },
            { 
              label: 'Profile Views', value: '248', change: 'Last 30 Days', icon: 'visibility', 
              iconBg: 'bg-purple-500/10', iconColor: 'text-purple-700', badgeBg: 'bg-purple-500/10', badgeColor: 'text-purple-700', badgeBorder: 'border-purple-500/20' 
            },
          ].map((metric, idx) => (
            <div key={idx} className="relative rounded-3xl h-40 flex flex-col justify-between overflow-hidden group shadow-sm border border-black/5 hover:shadow-md transition-all">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 z-0 opacity-40" 
                style={{ backgroundImage: "url('/metrics_bg.png')" }}
              />
              {/* Glass Overlay (lightened) */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-[2px] z-10" />
              
              {/* Content */}
              <div className="relative z-20 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">{metric.label}</p>
                  <div className={`w-10 h-10 rounded-2xl ${metric.iconBg} ${metric.iconColor} flex items-center justify-center shadow-inner`}>
                    <span className="material-symbols-outlined text-[22px]">{metric.icon}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-black font-serif tracking-tight">{metric.value}</span>
                    <span className={`${metric.badgeColor} text-[10px] font-bold ${metric.badgeBg} px-2.5 py-1 rounded-lg border ${metric.badgeBorder}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CRM Inbox Split Panel */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Recent Inquiries List */}
          <div className="lg:col-span-3 liquid-glass border border-black/5 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
            <div className="px-6 py-4.5 border-b border-black/5 flex justify-between items-center bg-white/50">
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-gray-600">inbox</span>
                Recent Inquiries Inbox
              </h2>
              {inquiries.length > 0 && (
                <span className="text-xs text-gray-500 font-bold bg-black/5 px-2.5 py-0.5 rounded-full">
                  {inquiries.length} total
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
                <Loader2 className="animate-spin text-black" size={24} />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Loading inquiries...</span>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-black/5 text-gray-400 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">drafts</span>
                </div>
                <h4 className="font-bold text-sm text-black mb-1">No inquiries yet</h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Once your profile is published and approved, customers will reach out to you here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-black/5 hide-scrollbar max-h-[600px]">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry._id}
                    onClick={() => setSelected(inquiry)}
                    className={`p-5 flex gap-4 cursor-pointer transition-all duration-200 ${
                      selected?._id === inquiry._id 
                        ? 'bg-black/5 border-l-4 border-black' 
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${getAvatarColor(inquiry.customerName)}`}>
                      {getInitials(inquiry.customerName)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="font-bold text-sm text-black truncate">{inquiry.customerName}</h4>
                        <span className="text-[10px] text-gray-400 font-bold shrink-0">{formatTime(inquiry.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{inquiry.message}</p>
                      <div className="pt-1 flex items-center gap-2">
                        {renderStatusBadge(inquiry.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Inquiry Detail View */}
          <div className="lg:col-span-2 liquid-glass border border-black/5 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
            {selected ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Sender details header */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shadow-sm ${getAvatarColor(selected.customerName)}`}>
                      {getInitials(selected.customerName)}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="font-bold text-base text-black truncate">{selected.customerName}</h3>
                      <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {new Date(selected.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <hr className="border-black/5" />

                  {/* Message body block */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Message</p>
                    <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 relative overflow-hidden">
                      <span className="material-symbols-outlined absolute right-3 bottom-3 text-black/5 text-[54px] pointer-events-none select-none font-bold">format_quote</span>
                      <p className="text-sm text-gray-700 leading-relaxed relative z-10 whitespace-pre-wrap">
                        {selected.message}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info Widget */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Channels</p>
                    <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3 shadow-inner">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-black/5 text-black flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px]">mail</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Email Address</p>
                          <a href={`mailto:${selected.customerEmail}`} className="text-xs font-bold text-black hover:underline block truncate">
                            {selected.customerEmail}
                          </a>
                        </div>
                      </div>
                      
                      {selected.customerPhone && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-black/5 text-black flex items-center justify-center">
                              <span className="material-symbols-outlined text-[16px]">call</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Phone Number</p>
                            <a href={`tel:${selected.customerPhone}`} className="text-xs font-bold text-black hover:underline block truncate">
                              {selected.customerPhone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification & Action buttons */}
                <div className="space-y-3 pt-6 border-t border-black/5">
                  <a 
                    href={`mailto:${selected.customerEmail}?subject=Regarding your inquiry on Aatmanirbhar Nari`}
                    className="w-full h-11 btn-bright font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">reply</span>
                    Reply via Email
                  </a>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatus(selected._id, 'contacted')} 
                      disabled={selected.status === 'contacted'}
                      className="flex-1 h-10 bg-white hover:bg-gray-100 disabled:opacity-50 text-black border border-black/10 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      Mark Contacted
                    </button>
                    <button 
                      onClick={() => handleStatus(selected._id, 'closed')} 
                      disabled={selected.status === 'closed'}
                      className="flex-1 h-10 bg-white hover:bg-gray-100 disabled:opacity-50 text-black border border-black/10 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px] text-rose-600">cancel</span>
                      Close Lead
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-black/5 text-gray-400 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">quick_reference_all</span>
                </div>
                <h4 className="font-bold text-sm text-black mb-1">No inquiry selected</h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Select a message from your inbox panel to see customer logs, contact details, and respond.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inquiries;
