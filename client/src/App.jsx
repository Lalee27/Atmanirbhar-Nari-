import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Eagerly loaded (essential for first paint)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy loaded
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const DashboardLayout = React.lazy(() => import('./components/DashboardLayout'));
const AdminLayout = React.lazy(() => import('./components/AdminLayout'));
const Inquiries = React.lazy(() => import('./pages/Inquiries'));
const SettingsView = React.lazy(() => import('./components/SettingsView'));
const LearningHub = React.lazy(() => import('./pages/LearningHub'));
const LearningSettings = React.lazy(() => import('./pages/LearningSettings'));
const BusinessMentor = React.lazy(() => import('./pages/BusinessMentor'));
const DashboardProfileRouter = React.lazy(() => import('./components/DashboardProfileRouter'));
const Orders = React.lazy(() => import('./pages/Orders'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const BusinessDetail = React.lazy(() => import('./pages/BusinessDetail'));
const Stories = React.lazy(() => import('./pages/Stories'));
const Mentors = React.lazy(() => import('./pages/Mentors'));
const BookSession = React.lazy(() => import('./pages/BookSession'));
const ApplyMentor = React.lazy(() => import('./pages/ApplyMentor'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const Support = React.lazy(() => import('./pages/Support'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));

const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-black" />
  </div>
);

function App() {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (stored.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <SocketProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="stories" element={<Stories />} />
              <Route path="mentors" element={<Mentors />} />
              <Route path="book-session/:id" element={<BookSession />} />
              <Route path="apply-mentor" element={<ApplyMentor />} />
              <Route path="mentor" element={<BusinessMentor />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="marketplace/:id" element={<BusinessDetail />} />
              <Route path="inquiries" element={<Inquiries />} />
              
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardProfileRouter />} />
                <Route path="profile" element={<DashboardProfileRouter />} />
                <Route path="orders" element={<Orders />} />
                <Route path="settings" element={<SettingsView />} />
              </Route>
              
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
              </Route>
              
              <Route path="learning" element={<LearningHub />} />
              <Route path="learning/settings" element={<LearningSettings />} />

              <Route path="support" element={<Support />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </SocketProvider>
  );
}

export default App;
