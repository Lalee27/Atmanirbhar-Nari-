import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F7F5F0] text-[#0a0a0a] font-sans overflow-hidden">
      
      {/* Global Hidden Details: Soft Airy Light Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gray-200/50 blur-[150px] rounded-full animate-pulse-subtle pointer-events-none z-0" style={{ animationDuration: '12s' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-50/50 blur-[180px] rounded-full animate-pulse-subtle pointer-events-none z-0" style={{ animationDuration: '18s', animationDelay: '2s' }} />
      
      {/* Global Noise Texture Overlay for Premium Feel */}
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main className="flex-grow pb-20 md:pb-0 pt-28">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
