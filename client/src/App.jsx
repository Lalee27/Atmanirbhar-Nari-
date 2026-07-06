import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import Inquiries from './pages/Inquiries';
import SettingsView from './components/SettingsView';
import LearningHub from './pages/LearningHub';
import LearningSettings from './pages/LearningSettings';
import BusinessMentor from './pages/BusinessMentor';
import BusinessProfile from './pages/BusinessProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BusinessDetail from './pages/BusinessDetail';
import Stories from './pages/Stories';
import Mentors from './pages/Mentors';
import BookSession from './pages/BookSession';
import ApplyMentor from './pages/ApplyMentor';
import VerifyEmail from './pages/VerifyEmail';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
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
            <Route index element={<BusinessProfile />} />
            <Route path="profile" element={<BusinessProfile />} />
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
    </Router>
  );
}

export default App;
