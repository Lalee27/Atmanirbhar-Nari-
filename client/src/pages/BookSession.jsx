import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    topic: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate booking process
    setSubmitted(true);
    setTimeout(() => {
      navigate('/mentors');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
        </div>
        <h2 className="text-headline-md font-bold text-on-surface mb-4">Booking Confirmed!</h2>
        <p className="text-body-lg text-on-surface-variant mb-8">
          Your session request has been sent to the mentor. You will receive an email confirmation shortly.
        </p>
        <p className="text-label-md text-on-surface-variant">Redirecting back to mentors...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Mentors</span>
        </button>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Book a Session</h1>
        <p className="text-body-lg text-on-surface-variant">
          Schedule a 1-on-1 session with your selected mentor to get personalized guidance.
        </p>
      </div>

      <div className="premium-card p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">Preferred Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">Preferred Time</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-md font-semibold text-on-surface mb-2">Topic of Discussion</label>
            <select
              name="topic"
              required
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              <option value="">Select a topic</option>
              <option value="business_strategy">Business Strategy & Scaling</option>
              <option value="marketing">Marketing & Brand Building</option>
              <option value="finance">Finance & Legal Basics</option>
              <option value="operations">Operations & Management</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-label-md font-semibold text-on-surface mb-2">Additional Information (Optional)</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell the mentor a bit about your business and what you'd like to achieve in this session..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-xl font-bold btn-hover-lift shadow-md hover:shadow-lg transition-all"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookSession;
