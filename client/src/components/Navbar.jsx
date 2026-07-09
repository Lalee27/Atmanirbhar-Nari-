import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { getNotifications, markAllNotificationsRead } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const socket = useSocket();

  // Sync user info on mount / location change
  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        setUserInfo(JSON.parse(info));
      } catch (e) {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [location]);

  // Fetch notifications
  useEffect(() => {
    if (userInfo && userInfo.token) {
      getNotifications().then((res) => {
        setNotifications(res.data);
      }).catch(err => console.error(err));
    } else {
      setNotifications([]);
    }
  }, [userInfo]);

  // Listen for socket events
  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        // Optional: show a toast or play a sound here
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/mentors', label: 'Mentors' },
    { path: '/learning', label: 'Learning' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="flex justify-between items-center w-full h-16 px-5 md:px-16 z-50 fixed top-4 left-0 right-0 max-w-[1400px] mx-auto liquid-glass !overflow-visible rounded-2xl border border-black/5 text-black font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-1 active:scale-95 transition-transform hover:bg-surface-container-low rounded-full"
        >
          <span className="material-symbols-outlined text-on-surface-variant">menu</span>
        </button>
        <Link to="/" className="flex items-center">
          <h1 className="text-headline-md font-bold text-primary">Aatmanirbhar Nari</h1>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-body-md transition-colors pb-1 ${
              isActive(link.path)
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        {userInfo && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 active:scale-95 transition-transform hover:bg-surface-container-low rounded-full relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant rounded-2xl shadow-xl z-50 p-4 animate-fade-in-up">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-title-sm font-bold text-on-surface">Notifications</h4>
                  {unreadCount > 0 && (
                    <span onClick={handleMarkAllRead} className="text-label-sm text-primary font-semibold cursor-pointer hover:underline">Mark all read</span>
                  )}
                </div>
                <hr className="border-outline-variant mb-3" />
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-label-md text-on-surface-variant text-center py-4">No notifications yet.</p>
                  ) : (
                    notifications.map((notif) => (
                      <Link 
                        key={notif._id} 
                        to={notif.link || '#'} 
                        onClick={() => setShowNotifications(false)}
                        className={`flex gap-3 p-2 rounded-xl transition-colors ${notif.isRead ? 'hover:bg-surface-container-low' : 'bg-primary-container/20 hover:bg-primary-container/30'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary flex-shrink-0">
                          <span className="material-symbols-outlined text-body-medium">
                            {notif.type === 'inquiry' ? 'inbox' : 'notifications'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-body-md text-on-surface font-semibold">{notif.title}</p>
                          <p className="text-label-md text-on-surface-variant leading-relaxed">{notif.message}</p>
                          <span className="text-label-sm text-on-surface-variant/70 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth-Aware User Profile */}
        <div className="relative" ref={userRef}>
          {userInfo ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 active:scale-95 transition-transform hover:bg-surface-container-low rounded-full cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-label-lg shadow-sm">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden lg:block text-body-md font-semibold text-on-surface-variant">{userInfo.name}</span>
            </button>
          ) : (
            <Link to="/login" className="p-2 active:scale-95 transition-transform hover:bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">account_circle</span>
            </Link>
          )}

          {showUserMenu && userInfo && (
            <div className="absolute right-0 mt-3 w-64 bg-surface border border-outline-variant rounded-2xl shadow-[0_20px_50px_-12px_rgba(157,67,27,0.15)] z-50 p-2.5 animate-fade-in-up backdrop-blur-md">
              {/* User Identity Header Card */}
              <div className="px-4 py-3.5 bg-surface-container-low rounded-xl mb-2 flex items-center gap-3 border border-outline-variant/35">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-label-lg shadow-sm shrink-0">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-body-md font-bold text-on-surface truncate leading-tight">{userInfo.name}</p>
                  <p className="text-label-sm text-on-surface-variant truncate mb-1">{userInfo.email}</p>
                  <span className="inline-block text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                    {userInfo.role}
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <Link
                  to={userInfo.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-on-surface hover:bg-primary/5 hover:text-primary transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[20px] transition-colors">dashboard</span>
                    <span className="text-label-lg font-semibold">My Dashboard</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">chevron_right</span>
                </Link>

                {userInfo.role !== 'admin' && (
                  <Link
                    to="/business-profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl text-on-surface hover:bg-primary/5 hover:text-primary transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[20px] transition-colors">storefront</span>
                      <span className="text-label-lg font-semibold">
                        {userInfo.role === 'entrepreneur' ? 'Edit Business Profile' : 'Register a Business'}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-outline opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">chevron_right</span>
                  </Link>
                )}
              </div>

              <hr className="border-outline-variant/50 my-2 mx-2" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-error hover:bg-error-container/20 text-label-lg font-bold transition-all duration-300 text-left cursor-pointer group scale-100 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-error text-[20px] group-hover:rotate-12 transition-transform">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-72 bg-surface z-50 shadow-2xl p-6 flex flex-col gap-2 md:hidden animate-fade-in-up border-r border-outline-variant">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-bold text-primary">Aatmanirbhar Nari</h2>
              <button onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-label-lg ${
                  isActive(link.path)
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4 border-outline-variant" />
            <Link
              to="/marketplace"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low text-label-lg"
            >
              <span className="material-symbols-outlined text-primary">storefront</span>
              Marketplace
            </Link>
            <Link
              to="/business-profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low text-label-lg"
            >
              <span className="material-symbols-outlined text-primary">add_business</span>
              Register Business
            </Link>
            {userInfo ? (
              <div className="mt-auto flex flex-col gap-2">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-label-lg shadow-sm">
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-label-lg font-bold text-on-surface">{userInfo.name}</p>
                    <p className="text-label-sm text-on-surface-variant truncate w-44">{userInfo.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-error-container text-on-error-container text-label-lg px-6 py-3 rounded-xl text-center active:scale-95 transition-transform font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-auto bg-primary text-white text-label-lg px-6 py-3 rounded-xl text-center active:scale-95 transition-transform font-semibold"
              >
                Get Started
              </Link>
            )}
          </div>
        </>
      )}
    </header>
  );
}
