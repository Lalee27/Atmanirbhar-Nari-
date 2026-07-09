import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { getBusinesses, resolveImageUrl } from '../services/api';

const CustomerProfile = () => {
  const { userInfo, inquiries } = useOutletContext();
  const navigate = useNavigate();
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getBusinesses({});
        // extract businesses from response and take the first 4 for recommendations
        const businessesList = data.businesses || [];
        setFeaturedBusinesses(businessesList.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-purple-100 text-purple-700';
      case 'replied': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up pb-10">
      <div className="premium-card rounded-3xl p-8 shadow-2xl shadow-black/5">
        <h2 className="text-2xl font-bold text-black mb-2 font-serif">Welcome back, {userInfo.name}!</h2>
        <p className="text-sm text-gray-600 mb-8 font-medium">
          Manage your account, track your inquiries, and discover local women-led services.
        </p>

        {/* Quick Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div onClick={() => navigate('/marketplace')} className="bg-black/5 p-4 rounded-2xl cursor-pointer hover:bg-black/10 transition-all border border-black/5 flex flex-col justify-center">
            <span className="material-symbols-outlined text-[28px] mb-2 text-black">storefront</span>
            <h4 className="font-bold text-sm text-black">Marketplace</h4>
          </div>
          <div onClick={() => navigate('/dashboard/orders')} className="bg-emerald-500/10 p-4 rounded-2xl cursor-pointer hover:bg-emerald-500/20 transition-all border border-emerald-500/10 flex flex-col justify-center">
            <span className="material-symbols-outlined text-[28px] mb-2 text-emerald-700">local_shipping</span>
            <h4 className="font-bold text-sm text-emerald-900">Track Orders</h4>
          </div>
          <div onClick={() => navigate('/inquiries')} className="bg-purple-500/10 p-4 rounded-2xl cursor-pointer hover:bg-purple-500/20 transition-all border border-purple-500/10 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[28px] mb-2 text-purple-700">mail</span>
              {inquiries.length > 0 && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{inquiries.length}</span>}
            </div>
            <h4 className="font-bold text-sm text-purple-900">My Inquiries</h4>
          </div>
        </div>

        {/* Dynamic Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          
          {/* Recent Inquiries Panel */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-bold text-black font-serif">Recent Inquiries</h3>
              <Link to="/inquiries" className="text-xs font-bold text-gray-500 hover:text-black underline">View All</Link>
            </div>
            <div className="flex flex-col gap-3">
              {inquiries.length === 0 ? (
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 font-medium">You haven't sent any inquiries yet.</p>
                  <button onClick={() => navigate('/marketplace')} className="mt-3 text-xs font-bold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Browse Marketplace</button>
                </div>
              ) : (
                inquiries.slice(0, 3).map(inq => (
                  <div key={inq._id} className="p-4 border border-black/10 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/inquiries')}>
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-sm font-bold text-black truncate">{inq.businessId?.name || 'Local Business'}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{inq.message}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getStatusColor(inq.status)}`}>
                      {inq.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recommended Services Panel */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-bold text-black font-serif">Featured Services</h3>
              <Link to="/marketplace" className="text-xs font-bold text-gray-500 hover:text-black underline">Explore All</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                <div className="col-span-2 text-center text-xs text-gray-500 p-4">Loading featured services...</div>
              ) : featuredBusinesses.length === 0 ? (
                <div className="col-span-2 p-6 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 font-medium">No featured businesses available right now.</p>
                </div>
              ) : (
                featuredBusinesses.map(biz => (
                  <div key={biz._id} onClick={() => navigate(`/marketplace/${biz._id}`)} className="group border border-black/10 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all bg-white relative">
                    <div className="h-24 overflow-hidden relative">
                      <img 
                        src={biz.images?.[0] ? resolveImageUrl(biz.images[0]) : 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={biz.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold truncate">{biz.name}</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-gray-500 font-semibold">{biz.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
