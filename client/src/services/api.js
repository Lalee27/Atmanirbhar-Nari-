import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      localStorage.removeItem('userInfo');
    }
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('userInfo');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') || 
    url.startsWith('https://') || 
    url.startsWith('data:') || 
    url.startsWith('/categories/')
  ) {
    return url;
  }
  const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const googleLogin = (data) => API.post('/auth/google', data);
export const verifyEmail = (data) => API.post('/auth/verify', data);
export const resendVerification = (data) => API.post('/auth/resend-verification', data);
export const sendGoogleOtp = (data) => API.post('/auth/google-otp-send', data);
export const verifyGoogleOtp = (data) => API.post('/auth/google-otp-verify', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.post('/auth/change-password', data);


export const getBusinesses = (params) => API.get('/businesses', { params });
export const getBusinessById = (id) => API.get(`/businesses/${id}`);
export const getMyBusiness = () => API.get('/businesses/mine');
export const updateBusinessProfile = (data) => API.post('/businesses', data);

export const submitInquiry = (data) => API.post('/inquiries', data);
export const getMyInquiries = () => API.get('/inquiries/mine');
export const updateInquiryStatus = (id, status) => API.patch(`/inquiries/${id}`, { status });

export const getMentorTopics = () => API.get('/mentor/topics');
export const getMentorAdvice = (data) => API.post('/mentor/advise', data);
export const chatWithGemini = (data) => API.post('/gemini/chat', data);

export const getAdminStats = () => API.get('/admin/stats');
export const getPublicStats = () => API.get('/admin/public-stats');
export const getPendingBusinesses = () => API.get('/admin/pending');
export const moderateBusiness = (id, action) => API.patch(`/admin/businesses/${id}`, { action });
export const getPendingMentors = () => API.get('/admin/mentors/pending');
export const moderateMentor = (id, action) => API.patch(`/admin/mentors/${id}`, { action });
export const submitMentorApplication = (formData) =>
  API.post('/mentor/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const uploadImages = (formData) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default API;
