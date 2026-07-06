import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { getMyInquiries, getMyBusiness, resolveImageUrl } from '../services/api';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inquiries, setInquiries] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  let userInfo = {};
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  } catch (e) {
    userInfo = {};
  }

  // Redirect if not logged in
  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }

  const fetchInquiries = async (showToastOnIncrease = false) => {
    try {
      const { data } = await getMyInquiries();
      setInquiries((prev) => {
        const prevNewCount = prev.filter((i) => i.status === 'new').length;
        const currentNewCount = data.filter((i) => i.status === 'new').length;
        if (showToastOnIncrease && currentNewCount > prevNewCount) {
          setToastMessage('New inquiry received! 🔔');
          setTimeout(() => setToastMessage(''), 4500);
        }
        return data;
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

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const getSidebarLinks = (role) => {
    let links = [];
    if (role === 'entrepreneur') {
      links = [
        { name: 'Profile Settings', icon: 'person', path: '/dashboard' },
        { name: 'Business Mentor', icon: 'psychology', path: '/mentor' },
      ];
    } else {
      // Customer by default
      links = [
        { name: 'Profile Settings', icon: 'person', path: '/dashboard' },
      ];
    }
    return links;
  };

  const sidebarLinks = getSidebarLinks(userInfo.role);

  return (
    <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row min-h-[90vh] pb-24 relative px-4 lg:px-8 gap-8 mt-6">
      
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

      {/* Modern Aside Sidebar */}
      <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
        {/* User Profile Widget */}
        <div className="premium-card rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg tracking-wider overflow-hidden shrink-0">
            {userInfo.profilePicture ? (
              <img src={resolveImageUrl(userInfo.profilePicture)} alt={userInfo.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(userInfo.name)
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-base text-black truncate">{userInfo.name || 'User'}</h4>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              {userInfo.role || 'customer'}
            </p>
          </div>
        </div>

        {/* Sidebar Nav links */}
        <div className="premium-card rounded-3xl p-4 flex flex-col gap-2 flex-1">
          <div className="flex flex-col gap-2">
            {sidebarLinks.map((tab) => {
              const isActive = location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname === '/dashboard/');
              return (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  end={tab.path === '/dashboard'}
          className={({ isActive: navIsActive }) => `w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive || navIsActive
                      ? 'bg-black text-white shadow-xl shadow-black/10 border border-black scale-[1.02]' 
                      : 'text-gray-500 hover:bg-black/5 hover:text-black hover:scale-[1.02]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                  {tab.name}
                </NavLink>
              );
            })}
          </div>
          
          <div className="mt-auto pt-3 border-t border-black/5 flex flex-col gap-2">
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => `w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'bg-black text-white shadow-xl shadow-black/10 border border-black scale-[1.02]' 
                  : 'text-gray-500 hover:bg-black/5 hover:text-black hover:scale-[1.02]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-200 cursor-pointer text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:scale-[1.01]"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 min-w-0">
        <Outlet context={{ 
          inquiries, setInquiries, 
          business, 
          loading, 
          userInfo, 
          newCount, 
          setToastMessage 
        }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
