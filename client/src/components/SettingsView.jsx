import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { updateProfile, changePassword, uploadImages, resolveImageUrl } from '../services/api';
import { Loader2 } from 'lucide-react';

const SettingsView = () => {
  const { setToastMessage, userInfo, setUserInfo } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences state
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
      setProfilePreviewUrl(stored.profilePicture || '');
      setTheme(stored.theme || 'light');
      if (stored.preferences) {
        setEmailNotifications(stored.preferences.emailNotifications ?? true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setProfilePreviewUrl('');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      let pictureUrl = profilePreviewUrl;

      // Upload image if a new file was selected
      if (profileImageFile) {
        const formData = new FormData();
        formData.append('images', profileImageFile);
        const { data } = await uploadImages(formData);
        if (data.urls && data.urls.length > 0) {
          pictureUrl = data.urls[0];
        }
      }

      const updateData = {
        profilePicture: pictureUrl,
        theme: theme,
        preferences: {
          emailNotifications: emailNotifications
        }
      };

      const { data } = await updateProfile(updateData);
      
      // Update localStorage with merged data
      const updatedInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      setProfilePreviewUrl(pictureUrl);
      
      setToastMessage('Settings saved successfully!');
    } catch (err) {
      setToastMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToastMessage('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setToastMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="premium-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5">
        <h2 className="text-2xl font-bold text-on-surface mb-2 font-serif">Account Settings</h2>
        <p className="text-sm text-on-surface-variant">Manage your profile picture, preferences, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile & Preferences Panel */}
        <div className="premium-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-on-surface border-b border-black/5 pb-3">Profile & Theme</h3>
          
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-surface-variant border border-black/10 overflow-hidden flex items-center justify-center shrink-0">
              {profilePreviewUrl ? (
                <img src={resolveImageUrl(profilePreviewUrl)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant">person</span>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-on-surface">Profile Picture</p>
              <div className="flex gap-2">
                <label className="px-4 py-2 bg-black/5 hover:bg-black/10 text-on-surface font-semibold text-xs rounded-xl cursor-pointer transition-all inline-block border border-transparent">
                  Upload New Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {profilePreviewUrl && (
                  <button 
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-error-container hover:bg-error-container/80 text-on-error-container font-semibold text-xs rounded-xl cursor-pointer transition-all border border-transparent"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4 pt-4 border-t border-black/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-on-surface">App Theme</p>
                <p className="text-xs text-on-surface-variant">Choose your preferred visual mode.</p>
              </div>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-2 bg-black/5 border border-black/10 rounded-xl text-sm font-semibold outline-none text-on-surface bg-surface"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-on-surface">Email Notifications</p>
                <p className="text-xs text-on-surface-variant">Receive important updates via email.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>



          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="mt-2 h-11 w-full bg-primary text-on-primary font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span className="material-symbols-outlined text-[18px]">save</span>}
            Save Profile Settings
          </button>
        </div>

        {/* Security Panel */}
        <div className="premium-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 flex flex-col gap-6 h-fit">
          <h3 className="text-lg font-bold text-on-surface border-b border-black/5 pb-3">Security</h3>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none transition-all text-sm text-on-surface"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none transition-all text-sm text-on-surface"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none transition-all text-sm text-on-surface"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-11 w-full bg-primary text-on-primary font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span className="material-symbols-outlined text-[18px]">lock_reset</span>}
              Update Password
            </button>
          </form>
        </div>
        
      </div>
    </section>
  );
};

export default SettingsView;
