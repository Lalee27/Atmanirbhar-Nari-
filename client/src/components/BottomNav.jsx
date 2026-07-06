import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/marketplace', label: 'Market', icon: 'storefront' },
    { path: '/mentor', label: 'Mentor', icon: 'psychology' },
    { path: '/dashboard', label: 'Leads', icon: 'dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 liquid-glass border-t border-black/5 rounded-t-3xl pb-safe">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 ${
            isActive(tab.path) ? 'text-black drop-shadow-[0_0_8px_rgba(0,0,0,0.1)] scale-110' : 'text-gray-400 hover:text-black active:scale-90'
          }`}
        >
          <span className="material-symbols-outlined drop-shadow-sm" style={isActive(tab.path) ? { fontVariationSettings: "'FILL' 1" } : {}}>
            {tab.icon}
          </span>
          <span className="text-label-sm mt-1">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
