import React, { useState } from 'react';
import { useNavigate, NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { resolveImageUrl } from '../services/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState('');

  let userInfo = {};
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  } catch (e) {
    userInfo = {};
  }

  // Redirect if not logged in or not admin
  if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const getInitials = (name) => {
    if (!name) return 'A';
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

  const sidebarLinks = [
    { name: 'Moderation Portal', icon: 'admin_panel_settings', path: '/admin' },
  ];

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
        <div className="liquid-glass border border-emerald-500/20 rounded-3xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 z-0"></div>
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg tracking-wider overflow-hidden shrink-0 z-10">
            {userInfo.profilePicture ? (
              <img src={resolveImageUrl(userInfo.profilePicture)} alt={userInfo.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(userInfo.name)
            )}
          </div>
          <div className="min-w-0 z-10">
            <h4 className="font-extrabold text-base text-black truncate">{userInfo.name || 'Admin'}</h4>
            <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
              Super Admin
            </p>
          </div>
        </div>

        {/* Sidebar Nav links */}
        <div className="liquid-glass border border-black/5 rounded-3xl p-3 flex flex-col gap-2 shadow-sm flex-1">
          <div className="flex flex-col gap-2">
            {sidebarLinks.map((tab) => {
              const isActive = location.pathname === tab.path || (tab.path === '/admin' && location.pathname === '/admin/');
              return (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  end={tab.path === '/admin'}
                  className={({ isActive: navIsActive }) => `w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive || navIsActive
                      ? 'bg-black text-white shadow-lg border border-black scale-[1.02]' 
                      : 'text-gray-500 hover:bg-black/5 hover:text-black hover:scale-[1.01]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                  {tab.name}
                </NavLink>
              );
            })}
          </div>
          
          <div className="mt-auto pt-3 border-t border-black/5 flex flex-col gap-2">
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
          userInfo, 
          setToastMessage 
        }} />
      </main>
    </div>
  );
};

export default AdminLayout;
