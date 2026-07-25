import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import BusinessProfile from '../pages/BusinessProfile';
import CustomerProfile from '../pages/CustomerProfile';
import { resolveImageUrl } from '../services/api';

const DashboardProfileRouter = () => {
  const { userInfo, business: businesses, fetchBusiness } = useOutletContext();
  const [editingBusiness, setEditingBusiness] = useState(null); // null means list, 'new' means create, object means edit

  if (userInfo?.role === 'entrepreneur') {
    if (editingBusiness) {
      return (
        <BusinessProfile 
          businessToEdit={editingBusiness === 'new' ? null : editingBusiness} 
          onCancel={() => setEditingBusiness(null)}
          onSuccess={() => {
            if (fetchBusiness) fetchBusiness();
            setEditingBusiness(null);
          }}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Businesses</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your multiple business profiles</p>
          </div>
          <button 
            onClick={() => setEditingBusiness('new')} 
            className="btn-bright px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New
          </button>
        </div>

        {!businesses || businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-black/5">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">storefront</span>
            <p className="text-gray-500 font-semibold">You don't have any businesses yet.</p>
            <button onClick={() => setEditingBusiness('new')} className="mt-4 text-emerald-600 font-bold hover:underline">Create your first business</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses.map((biz) => (
              <div key={biz._id} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  {biz.images && biz.images[0] ? (
                    <img src={resolveImageUrl(biz.images[0])} alt={biz.name} className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined text-3xl">image</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{biz.name}</h3>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full uppercase tracking-wider">{biz.category}</span>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{biz.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                  <button 
                    onClick={() => setEditingBusiness(biz)} 
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <CustomerProfile />;
};

export default DashboardProfileRouter;
