import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitMentorApplication } from '../services/api';

const ApplyMentor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    expertise: '',
    experience: '',
    whyJoin: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await submitMentorApplication(data);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/mentors');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
        </div>
        <h2 className="text-headline-md font-bold text-on-surface mb-4">Application Submitted!</h2>
        <p className="text-body-lg text-on-surface-variant mb-8">
          Thank you for applying to be a mentor. Our team will review your application and get back to you soon.
        </p>
        <p className="text-label-md text-on-surface-variant">Redirecting back to mentors...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Mentors</span>
        </button>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Apply as a Mentor</h1>
        <p className="text-body-lg text-on-surface-variant">
          Share your expertise and empower the next generation of women entrepreneurs. Join our network of successful business leaders.
        </p>
      </div>

      <div className="premium-card p-8 rounded-2xl">
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-label-md font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-label-md font-semibold text-on-surface mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center bg-surface-container-low overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-outline-variant text-[32px]">person</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-label-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                />
                <p className="text-label-sm text-outline-variant mt-2">Recommended: Square image, max 2MB (JPG, PNG)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="+91 xxxxx xxxxx"
              />
            </div>
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="https://linkedin.com/in/janedoe"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-md font-semibold text-on-surface mb-2">Area of Expertise</label>
            <select
              name="expertise"
              required
              value={formData.expertise}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              <option value="">Select your primary expertise</option>
              <option value="business_strategy">Business Strategy & Scaling</option>
              <option value="marketing">Marketing & Brand Building</option>
              <option value="finance">Finance & Legal Basics</option>
              <option value="operations">Operations & Management</option>
              <option value="tech">Technology & E-commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-label-md font-semibold text-on-surface mb-2">Years of Experience</label>
            <input
              type="number"
              name="experience"
              required
              min="0"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="e.g., 5"
            />
          </div>



          <div>
            <label className="block text-label-md font-semibold text-on-surface mb-2">Why do you want to join as a mentor?</label>
            <textarea
              name="whyJoin"
              required
              rows="4"
              value={formData.whyJoin}
              onChange={handleChange}
              placeholder="Tell us about your motivation to help other women entrepreneurs..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold btn-hover-lift shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyMentor;
