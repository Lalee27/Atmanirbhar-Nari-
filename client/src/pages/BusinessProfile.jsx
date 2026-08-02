import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBusiness, updateBusinessProfile, resolveImageUrl, uploadImages, getCategories } from '../services/api';

const STEPS = ['Account', 'Business Profile', 'Showcase', 'Review'];

const BusinessProfile = ({ businessToEdit, onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [area, setArea] = useState('');
  const [images, setImages] = useState([]);
  const [startingPrice, setStartingPrice] = useState('');
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState({
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 18:00',
    saturday: '10:00 - 14:00',
    sunday: 'Closed',
  });

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    const catObj = dynamicCategories.find(c => c.name === catName);
    if (images.length === 0 && catObj && catObj.image) {
      setImages([catObj.image]);
    }
  };

useEffect(() => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    navigate('/login');
    return;
  }

  const initData = async () => {
    try {
      const res = await getCategories();
      const fetchedCats = res.data || [];
      setDynamicCategories(fetchedCats);
      const defaultCat = fetchedCats.length > 0 ? fetchedCats[0].name : '';

      if (businessToEdit) {
        // Editing existing business
        const data = businessToEdit;
        setName(data.name || '');
        setCategory(data.category || defaultCat);
        setExperienceLevel(data.experienceLevel || '');
        setDescription(data.description || '');
        setPhone(data.phone || '');
        setDemoVideoUrl(data.demoVideoUrl || '');
        setMeetingLink(data.meetingLink || '');
        setCity(data.location?.city || '');
        setState(data.location?.state || '');
        setArea(data.location?.area || '');
        setImages(data.images?.length ? data.images : []);
        setStartingPrice(data.startingPrice || '');
        setServices(data.services || []);
        setServices(data.services || []);
        if (data.availability) setAvailability(data.availability);
      } else {
        // Creating new business, reset form
        setName('');
        setCategory(defaultCat);
        setExperienceLevel('');
        setDescription('');
        setPhone('');
        setDemoVideoUrl('');
        setMeetingLink('');
        setCity('');
        setState('');
        setArea('');
        setImages(fetchedCats.length > 0 && fetchedCats[0].image ? [fetchedCats[0].image] : []);
        setStartingPrice('');
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };
  initData();
}, [navigate, businessToEdit]);

const handleImageUpload = async (e, type, index) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large. Max size is 5MB.');
    return;
  }

  const formData = new FormData();
  formData.append('images', file);

  try {
    setLoading(true);
    const { data } = await uploadImages(formData);
    if (data.urls && data.urls.length > 0) {
      const uploadedUrl = data.urls[0];
      if (type === 'galleryImage') {
        if (index !== undefined && index !== null) {
          const next = [...images];
          next[index] = uploadedUrl;
          setImages(next);
        } else {
          setImages([...images, uploadedUrl]);
        }
      }
    }
  } catch (err) {
    alert('Failed to upload image. ' + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
    e.target.value = ''; // Reset file input
  }
};

const handleSubmit = async () => {
  setLoading(true);
  setError('');
  const payload = {
    _id: businessToEdit?._id, // Passing _id tells the backend to update
    name,
    category,
    experienceLevel,
    description,
    phone,
    demoVideoUrl,
    meetingLink,
    location: { city, state, area },
    images,
    startingPrice: startingPrice ? Number(startingPrice) : undefined,
    services: services.filter(s => s.name?.trim() !== '' && s.price !== ''),
    availability,
  };
  try {
    await updateBusinessProfile(payload);
    setSuccess(true);
    // Wait a bit, then notify parent to refresh businesses
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 2000);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to save profile');
  } finally {
    setLoading(false);
  }
};

const logoPreview = images[0] ? resolveImageUrl(images[0]) : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=300';

return (
  <div className="page-container flex flex-col gap-12 animate-fade-in-up">
    {/* Header */}
    <div className="flex flex-col gap-2">
      {onCancel && (
        <button onClick={onCancel} className="text-gray-500 font-bold hover:text-black flex items-center gap-1 cursor-pointer self-start mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to My Businesses
        </button>
      )}
      <h1 className="text-headline-lg text-on-surface font-bold">
        {businessToEdit ? 'Edit Business Profile' : 'Create Business Profile'}
      </h1>
      <p className="text-body-md text-on-surface-variant">
        Fill out the details below to set up your comprehensive storefront.
      </p>
    </div>

    <section className="flex-1 w-full max-w-4xl mx-auto">
      <div className="standard-card p-6 md:p-10 w-full mb-10 shadow-sm border border-black/5">
        {error && <p className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-label-md shadow-sm border border-error/20">{error}</p>}

        {success ? (
          <div className="space-y-6 animate-fade-in-up text-center py-12">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h2 className="text-3xl font-bold text-black">Profile Submitted!</h2>
            <p className="text-gray-600 max-w-md mx-auto text-body-lg">
              Your business profile has been successfully saved. It is now under review by our team and will be live shortly.
            </p>
            <div className="pt-8 flex justify-center gap-4">
              <button type="button" onClick={() => { if (onSuccess) onSuccess(); else navigate('/dashboard'); }} className="px-8 py-3 bg-black text-white rounded-xl cursor-pointer font-bold transition-all hover:scale-105 shadow-md">
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-12" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            
            {/* --- SECTION 1: BUSINESS DETAILS --- */}
            <div className="space-y-8 animate-fade-in">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[28px]">store</span>
                  1. Basic Details
                </h2>
                <p className="text-gray-500 mt-1 ml-9 text-sm">Tell us about your business identity and location.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Business Name */}
                <div className="space-y-2 relative group md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 pl-1">
                    Business Name <span className="text-error">*</span>
                  </label>
                  <input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-body-md text-gray-800 transition-all placeholder:text-gray-400" placeholder="E.g. Sharma Tiffin Services" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                {/* Categories */}
                <div className="space-y-3 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 pl-1">
                    Category <span className="text-error">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {dynamicCategories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${category === cat.name ? 'bg-primary text-white border-primary shadow-md transform scale-[1.02]' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                    {dynamicCategories.length === 0 && <span className="text-gray-400 text-sm">Loading categories...</span>}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 pl-1">
                    Experience Level
                  </label>
                  <input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-body-md text-gray-800 transition-all placeholder:text-gray-400" placeholder="E.g. 5+ Years, Beginner, Expert" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 pl-1">
                    Contact Phone <span className="text-error">*</span>
                  </label>
                  <input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-body-md text-gray-800 transition-all placeholder:text-gray-400" placeholder="+91 xxxxx xxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                {/* Business Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 pl-1">
                    Business Description <span className="text-error">*</span>
                  </label>
                  <textarea className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-body-md resize-none text-gray-800 transition-all placeholder:text-gray-400" rows={4} placeholder="Describe what you do, what makes your business special..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                {/* Location Details */}
                <div className="space-y-3 p-6 bg-surface-container/30 rounded-3xl border border-outline-variant md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                    Location Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-body-sm transition-all" placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <input className="h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-body-sm transition-all" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                    <input className="h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-body-sm transition-all" placeholder="Area / Locality" value={area} onChange={(e) => setArea(e.target.value)} />
                  </div>
                </div>

                {/* Conditional Coaching Details */}
                {category === 'Tuition & Coaching' && (
                  <div className="space-y-5 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 md:col-span-2">
                    <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">school</span>
                      Online Coaching Details
                    </h3>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-blue-800/80 uppercase tracking-wider pl-1">Demo Video URL (YouTube Embed Link)</label>
                      <input className="w-full h-12 px-4 rounded-xl bg-white border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none text-body-sm" placeholder="E.g. https://www.youtube.com/embed/..." value={demoVideoUrl} onChange={(e) => setDemoVideoUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-blue-800/80 uppercase tracking-wider pl-1">Meeting Link (Zoom/Meet)</label>
                      <input className="w-full h-12 px-4 rounded-xl bg-white border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none text-body-sm" placeholder="E.g. https://zoom.us/j/..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- SECTION 2: AVAILABILITY & SERVICES --- */}
            <div className="space-y-8 animate-fade-in pt-8 border-t border-black/10">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[28px]">work</span>
                  2. Operations & Offerings
                </h2>
                <p className="text-gray-500 mt-1 ml-9 text-sm">Define your working hours and the services you provide.</p>
              </div>

              {/* Availability Configuration */}
              <div className="space-y-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                  <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                  Weekly Availability
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(availability).map(([day, hours]) => (
                    <div key={day} className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold capitalize text-gray-700 ml-1">{day}</span>
                      <input 
                        className="w-full h-11 px-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm" 
                        value={hours}
                        onChange={(e) => setAvailability({...availability, [day]: e.target.value})}
                        placeholder="09:00 - 18:00"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-surface-container/20 p-4 rounded-xl border border-outline-variant">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">format_list_bulleted</span>
                      Services / Packages
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">List specific services and their prices.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setServices([...services, { name: '', price: '', description: '' }])}
                    className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-md transition-all text-sm flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span> Add Service
                  </button>
                </div>

                {services.length === 0 ? (
                  <p className="text-sm text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">No services added yet. Click 'Add Service' to list your offerings.</p>
                ) : (
                  <div className="space-y-4">
                    {services.map((svc, idx) => (
                      <div key={idx} className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl relative group transition-all hover:border-primary/30">
                        <button 
                          type="button" 
                          onClick={() => {
                            const next = [...services];
                            next.splice(idx, 1);
                            setServices(next);
                          }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Service Name *</label>
                            <input className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-colors" placeholder="E.g., Monthly Veg Tiffin" value={svc.name} onChange={e => { const next = [...services]; next[idx].name = e.target.value; setServices(next); }} required />
                          </div>
                          <div className="md:col-span-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Price (₹) *</label>
                            <input className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-colors" type="number" placeholder="2500" value={svc.price} onChange={e => { const next = [...services]; next[idx].price = e.target.value; setServices(next); }} required />
                          </div>
                          <div className="md:col-span-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">Description (Optional)</label>
                            <input className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-colors" placeholder="Brief details..." value={svc.description} onChange={e => { const next = [...services]; next[idx].description = e.target.value; setServices(next); }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* --- SECTION 3: MEDIA & GALLERY --- */}
            <div className="space-y-8 animate-fade-in pt-8 border-t border-black/10">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[28px]">collections</span>
                  3. Media & Showcase
                </h2>
                <p className="text-gray-500 mt-1 ml-9 text-sm">Upload up to 5 photos showcasing your business or best products. The first image will be your main Cover Photo.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[0, 1, 2, 3, 4].map((index) => {
                  const isCover = index === 0;
                  return (
                    <div key={index} className={`relative rounded-2xl overflow-hidden border-2 border-dashed ${images[index] ? 'border-transparent shadow-md' : 'border-gray-300 hover:border-primary hover:bg-primary/5'} bg-gray-50 aspect-square group transition-all flex flex-col items-center justify-center`}>
                      {images[index] ? (
                        <>
                          <img src={resolveImageUrl(images[index])} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <label className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-black cursor-pointer hover:scale-110 transition-transform shadow-lg" title="Change Image">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'galleryImage', index)} />
                            </label>
                            {!isCover && (
                              <button type="button" onClick={() => {
                                const next = [...images];
                                next.splice(index, 1);
                                setImages(next);
                              }} className="w-10 h-10 flex items-center justify-center bg-error text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg" title="Remove Image">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                          {isCover && (
                            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">Cover</span>
                          )}
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 group-hover:text-primary transition-colors p-4 text-center">
                          <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                          <span className="text-xs font-semibold">{isCover ? 'Add Cover' : 'Add Photo'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'galleryImage', index)} />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-8 border-t border-black/10 flex justify-between items-center sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 -mx-4 md:-mx-10 rounded-b-xl border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
              <p className="text-xs font-semibold text-gray-400 hidden sm:block uppercase tracking-wider">Please review your info before submitting</p>
              <div className="flex gap-4 w-full sm:w-auto">
                <button type="submit" disabled={loading} className="btn-bright w-full sm:w-auto px-12 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold text-lg disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                  {loading ? 'Submitting...' : (businessToEdit ? 'Save Changes' : 'Submit Profile')}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  </div>
);
};

export default BusinessProfile;
