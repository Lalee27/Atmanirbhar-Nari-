import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBusinesses, resolveImageUrl } from '../services/api';

const FILTER_CATS = [
  'Nearby',
  'Tiffin Services',
  'Tailoring & Fashion',
  'Beauty & Wellness',
  'Handicrafts',
  'Tuition & Coaching',
  'Home Decors',
  'Cooking Classes',
  'Fitness & Yoga',
  'Event Management'
];

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState('');
  const [availableToday, setAvailableToday] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advanced filters states
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  // Sync search state when URL search query changes (e.g. from Navbar search)
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {
          category: activeFilter !== 'Nearby' ? activeFilter : undefined,
          city: city || undefined,
          search: search || undefined,
          availableToday: availableToday ? 'true' : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          minRating: minRating || undefined,
        };
        const { data } = await getBusinesses(params);
        setBusinesses(data);
      } catch {
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [activeFilter, search, city, availableToday, minPrice, maxPrice, minRating]);

  const minPriceVal = (biz) => {
    if (!biz.services?.length) return '—';
    const min = Math.min(...biz.services.map((s) => s.price));
    return min;
  };

  const locationLabel = (biz) => {
    const parts = [biz.location?.area, biz.location?.city].filter(Boolean);
    return parts.join(', ') || 'Local';
  };

  return (
    <div className="max-w-6xl mx-auto px-5 pt-6 pb-24 animate-fade-in-up">
      <section className="mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full liquid-glass border border-black/10 h-14 pl-12 pr-4 rounded-xl shadow-sm focus:ring-2 focus:ring-black/15 text-body-md outline-none transition-all placeholder:text-gray-400 text-black"
              placeholder="Search businesses or services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <input
              className="w-36 h-14 px-4 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-black/15 text-body-md liquid-glass shadow-sm placeholder:text-gray-400 text-black"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`h-14 px-5 rounded-xl border-2 transition-all flex items-center gap-2 text-label-lg font-bold cursor-pointer active:scale-95 ${
                showAdvanced 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : 'bg-white border-black/10 text-black hover:bg-black/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              Filters
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showAdvanced && (
          <div className="mt-4 p-5 liquid-glass border border-black/10 rounded-2xl shadow-sm animate-fade-in-up grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <label className="text-label-lg font-bold text-on-surface block mb-2">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-11 px-3 liquid-glass border border-black/10 rounded-lg text-body-sm outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 placeholder:text-gray-400 text-black"
                />
                <span className="text-outline text-label-lg font-bold">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-11 px-3 liquid-glass border border-black/10 rounded-lg text-body-sm outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 placeholder:text-gray-400 text-black"
                />
              </div>
            </div>

            {/* Rating Selector */}
            <div>
              <label className="text-label-lg font-bold text-on-surface block mb-2">Minimum Rating</label>
              <div className="flex gap-2">
                {[
                  { value: '', label: 'All' },
                  { value: '4', label: '4.0+ ★' },
                  { value: '4.5', label: '4.5+ ★' }
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setMinRating(r.value)}
                    className={`flex-1 h-11 rounded-lg text-label-md font-bold transition-all cursor-pointer border active:scale-95 ${
                      minRating === r.value 
                        ? 'bg-black text-white border-black shadow-sm font-extrabold' 
                        : 'liquid-glass border-black/10 text-gray-600 hover:bg-black/5'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setMinRating('');
                  setCity('');
                  setAvailableToday(false);
                }}
                className="w-full h-11 border-2 border-dashed border-error/50 hover:border-error text-error hover:bg-error/5 font-bold rounded-lg text-label-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Categories Chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar pb-2 items-center">
          {FILTER_CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`category-toggle ${activeFilter === cat ? 'active' : ''}`}
            >
              {cat === 'Nearby' && <span className="material-symbols-outlined text-[18px]">location_on</span>}
              {cat}
            </button>
          ))}
          <button
            onClick={() => setAvailableToday(!availableToday)}
            className={`category-toggle ${availableToday ? 'active' : ''}`}
          >
            Available today
          </button>
        </div>
      </section>

      <section className="animate-fade-in-up animate-delay-200">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-headline-md text-primary font-bold">Discover Businesses</h2>
            <p className="text-on-surface-variant text-body-sm">Women-led home businesses near you</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-on-surface-variant font-semibold">Loading marketplace...</p>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-surface-container rounded-2xl border border-outline-variant p-8">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">storefront</span>
            <p className="mt-3 text-body-lg font-bold text-on-surface">No verified listings found</p>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">Try adjusting your filters, price range, or search term query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {businesses.map((biz) => (
              <div key={biz._id} className="liquid-glass rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-black/5 card-hover group premium-card">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={biz.images?.[0] ? resolveImageUrl(biz.images[0]) : 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=500'}
                    alt={biz.name}
                    loading="lazy"
                  />
                  {biz.isVerified && (
                    <span className="absolute top-3 left-3 bg-white/90 text-primary text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-label-lg text-on-surface font-bold truncate flex-1">{biz.name}</h4>
                    {biz.rating && biz.rating > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-alert-gold/15 text-alert-gold rounded-full flex items-center gap-0.5">
                        ★ {biz.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-label-sm text-outline flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {locationLabel(biz)}
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1 font-semibold">{biz.category}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-surface-container-highest mt-3">
                    <div>
                      <p className="text-label-sm text-outline">Starts from</p>
                      <p className="text-headline-md text-primary font-bold">₹{minPriceVal(biz)}</p>
                    </div>
                    <Link to={`/marketplace/${biz._id}`} className="bg-primary text-white px-4 py-2 rounded-lg text-label-md active:scale-95 cursor-pointer hover:opacity-90 font-bold shadow-sm transition-opacity">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;
