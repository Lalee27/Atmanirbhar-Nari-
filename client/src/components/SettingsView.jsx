import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { updateProfile, changePassword, uploadImages, resolveImageUrl } from '../services/api';
import { Loader2 } from 'lucide-react';

const SettingsView = () => {
  const { setToastMessage } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
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
      setUserInfo(stored);
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
        <h2 className="text-2xl font-bold text-black mb-2 font-serif">Account Settings</h2>
        <p className="text-sm text-gray-500">Manage your profile picture, preferences, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile & Preferences Panel */}
        <div className="premium-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-black border-b border-black/5 pb-3">Profile & Theme</h3>
          
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 border border-black/10 overflow-hidden flex items-center justify-center shrink-0">
              {profilePreviewUrl ? (
                <img src={profilePreviewUrl.startsWith('http') || profilePreviewUrl.startsWith('data:') ? profilePreviewUrl : resolveImageUrl(profilePreviewUrl)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[40px] text-gray-300">person</span>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-black">Profile Picture</p>
              <div className="flex gap-2">
                <label className="px-4 py-2 bg-black/5 hover:bg-black/10 text-black font-semibold text-xs rounded-xl cursor-pointer transition-all inline-block border border-transparent">
                  Upload New Photo
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageChange} />
                </label>
                {profilePreviewUrl && (
                  <button 
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl cursor-pointer transition-all border border-transparent"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400">JPG, PNG or WebP accepted.</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4 pt-4 border-t border-black/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-black">App Theme</p>
                <p className="text-xs text-gray-500">Choose your preferred visual mode.</p>
              </div>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-2 bg-black/5 border border-black/10 rounded-xl text-sm font-semibold outline-none"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-black">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive important updates via email.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>



          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="mt-2 h-11 w-full bg-black text-white font-bold text-sm rounded-xl hover:bg-black/80 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span className="material-symbols-outlined text-[18px]">save</span>}
            Save Profile Settings
          </button>
        </div>

        {/* Security Panel */}
        <div className="premium-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 flex flex-col gap-6 h-fit">
          <h3 className="text-lg font-bold text-black border-b border-black/5 pb-3">Security</h3>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-11 w-full bg-black text-white font-bold text-sm rounded-xl hover:bg-black/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
