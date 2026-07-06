import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBusiness, updateBusinessProfile, resolveImageUrl } from '../services/api';

const CATEGORIES = [
  'Tiffin Services',
  'Tailoring & Fashion',
  'Beauty & Wellness',
  'Handicrafts',
  'Tuition & Coaching',
];

const CATEGORY_DEFAULT_IMAGES = {
  'Tiffin Services': '/categories/tiffin_services.png',
  'Tailoring & Fashion': '/categories/tailoring_fashion.png',
  'Beauty & Wellness': '/categories/beauty_wellness.png',
  'Handicrafts': '/categories/handicrafts.png',
  'Tuition & Coaching': '/categories/tuition_coaching.png',
};

const STEPS = ['Account', 'Business Profile', 'Showcase', 'Review'];

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [area, setArea] = useState('');
  const [images, setImages] = useState([CATEGORY_DEFAULT_IMAGES[CATEGORIES[0]]]);
  const [services, setServices] = useState([{ name: '', price: '', description: '' }]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (images.length === 0 || Object.values(CATEGORY_DEFAULT_IMAGES).includes(images[0])) {
      setImages([CATEGORY_DEFAULT_IMAGES[cat]]);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    getMyBusiness()
      .then(({ data }) => {
        setName(data.name || '');
        setCategory(data.category || CATEGORIES[0]);
        setDescription(data.description || '');
        setPhone(data.phone || '');
        setCity(data.location?.city || '');
        setState(data.location?.state || '');
        setArea(data.location?.area || '');
        setImages(data.images?.length ? data.images : [CATEGORY_DEFAULT_IMAGES[data.category || CATEGORIES[0]]]);
        if (data.services?.length) setServices(data.services);
        setStep(2);
      })
      .catch(() => setStep(1));
  }, [navigate]);

  const addService = () => setServices([...services, { name: '', price: '', description: '' }]);

  const updateService = (index, field, value) => {
    const next = [...services];
    next[index] = { ...next[index], [field]: value };
    setServices(next);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const payload = {
      name,
      category,
      description,
      phone,
      location: { city, state, area },
      images,
      services: services
        .filter((s) => s.name && s.price)
        .map((s) => ({ ...s, price: Number(s.price) })),
    };
    try {
      await updateBusinessProfile(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const logoPreview = images[0] ? resolveImageUrl(images[0]) : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=300';

  return (
    <div className="flex flex-col md:flex-row gap-12 animate-fade-in-up">
      <aside className="w-full md:w-1/3 flex flex-col gap-8 shrink-0">
        <div>
          <h1 className="text-headline-lg text-on-surface font-bold">Entrepreneur Profile Wizard</h1>
          <p className="text-body-md text-on-surface-variant">
            Step {step} of 4: {STEPS[step - 1]}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {STEPS.map((label, idx) => {
            const num = idx + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={label} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${
                    done ? 'bg-secondary border-secondary text-white' : active ? 'border-primary text-primary' : 'border-outline-variant text-on-surface-variant'
                  }`}
                >
                  {done ? <span className="material-symbols-outlined text-sm">check</span> : num}
                </div>
                <div>
                  <span className={`text-label-lg ${active ? 'text-primary font-semibold' : done ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="flex-1">
        <div className="premium-card rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5">
          {error && <p className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-label-md">{error}</p>}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-body-md text-on-surface-variant">Create an account to register your business on the platform.</p>
              <button type="button" onClick={() => navigate('/register')} className="px-8 py-3.5 btn-bright rounded-xl font-semibold cursor-pointer">
                Create Account
              </button>
              <button type="button" onClick={() => setStep(2)} className="block text-primary font-semibold hover:underline">
                Already registered? Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <form className="flex flex-col gap-7" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Business Name</label>
                <input className="w-full h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" placeholder="E.g. Sharma Tiffin Services" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat} 
                    type="button" 
                    onClick={() => handleCategoryChange(cat)} 
                    className={`category-toggle ${category === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5 mt-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Business Description</label>
                <textarea className="w-full p-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md resize-none text-black transition-all shadow-inner" rows={4} placeholder="Describe what you do..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Contact Phone</label>
                <input className="w-full h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Location Details</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input className="h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className="h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                  <input className="h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" placeholder="Area / Locality" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="self-end px-10 py-3.5 btn-bright rounded-xl font-semibold cursor-pointer">Continue</button>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-label-lg font-semibold">Default Portfolio Image</h3>
                <p className="text-body-sm text-on-surface-variant mb-2">This image has been automatically set based on your selected service category.</p>
                {images.length > 0 && (
                  <div className="w-full mt-4">
                    {images.map((url, i) => (
                      <img key={i} src={resolveImageUrl(url)} alt="Category Default" className="w-full h-64 md:h-80 object-cover rounded-xl shadow-sm" />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-label-lg font-semibold">Services & pricing</h3>
              {services.map((s, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input placeholder="Service name" value={s.name} onChange={(e) => updateService(i, 'name', e.target.value)} className="h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" />
                  <input placeholder="Price (₹)" type="number" value={s.price} onChange={(e) => updateService(i, 'price', e.target.value)} className="h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" />
                  <input placeholder="Short description" value={s.description} onChange={(e) => updateService(i, 'description', e.target.value)} className="h-14 px-5 rounded-2xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none text-body-md text-black transition-all shadow-inner" />
                </div>
              ))}
              <button type="button" onClick={addService} className="text-secondary font-semibold text-label-md cursor-pointer hover:underline">+ Add another service</button>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 border border-black/10 hover:bg-black/5 text-black rounded-xl cursor-pointer font-semibold transition-all">Back</button>
                <button type="button" onClick={() => setStep(4)} className="px-10 py-3.5 btn-bright rounded-xl cursor-pointer font-semibold">Continue</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="p-6 bg-black/5 border-2 border-black/10 rounded-3xl flex flex-col md:flex-row gap-6 items-center md:items-start transition-all hover:bg-black/[0.07]">
                <img src={logoPreview} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                <div className="text-center md:text-left">
                  <p className="font-bold text-2xl text-black">{name}</p>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">{category}</p>
                  <p className="text-body-md text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {city}{state ? `, ${state}` : ''}
                  </p>
                </div>
              </div>
              <p className="text-body-md text-on-surface-variant">Your profile will be reviewed by our team before appearing in the marketplace.</p>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(3)} className="px-6 py-3 border border-black/10 hover:bg-black/5 text-black rounded-xl cursor-pointer font-semibold transition-all">Back</button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="px-10 py-3.5 btn-bright rounded-xl cursor-pointer disabled:opacity-60 font-semibold">
                  {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BusinessProfile;
