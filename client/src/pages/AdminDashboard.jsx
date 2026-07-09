import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getPendingBusinesses, moderateBusiness, resolveImageUrl, getPendingMentors, moderateMentor } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [statsRes, pendingRes, mentorsRes] = await Promise.all([
        getAdminStats(), 
        getPendingBusinesses(),
        getPendingMentors()
      ]);
      setStats(statsRes.data);
      setPending(pendingRes.data.businesses || []);
      setPendingMentors(mentorsRes.data.mentors || []);
    } catch {
      setStats(null);
      setPending([]);
      setPendingMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    } catch (e) {
      user = {};
    }

    load();

    const interval = setInterval(() => {
      load();
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleModerate = async (id, action) => {
    try {
      await moderateBusiness(id, action);
      setPending((prev) => prev.filter((b) => b._id !== id));
      if (stats) {
        setStats({
          ...stats,
          pendingApprovals: Math.max(0, stats.pendingApprovals - 1),
          activeListings: action === 'approve' ? stats.activeListings + 1 : stats.activeListings,
        });
      }
    } catch {
      /* ignore */
    }
  };

  const handleModerateMentor = async (id, action) => {
    try {
      await moderateMentor(id, action);
      setPendingMentors((prev) => prev.filter((m) => m._id !== id));
      if (stats) {
        setStats({
          ...stats,
          pendingMentors: Math.max(0, (stats.pendingMentors || 0) - 1),
        });
      }
    } catch {
      /* ignore */
    }
  };

  const formatDate = (d) => {
    const diff = (Date.now() - new Date(d)) / 3600000;
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${Math.floor(diff)} hours ago`;
    return `${Math.floor(diff / 24)} days ago`;
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl text-primary font-bold font-sans">Moderator Verification Portal</h1>
        <p className="text-body-lg text-on-surface-variant mt-2">Review and approve entrepreneur profiles for marketplace quality.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="col-span-full text-on-surface-variant">Loading stats...</p>
        ) : stats ? (
          [
            { label: 'Total Entrepreneurs', value: stats.totalEntrepreneurs, color: 'text-primary' },
            { label: 'Pending Businesses', value: stats.pendingApprovals, color: 'text-secondary' },
            { label: 'Pending Mentors', value: stats.pendingMentors || 0, color: 'text-secondary' },
            { label: 'Active Listings', value: stats.activeListings, color: 'text-primary' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border card-hover flex flex-col justify-between">
              <p className="text-label-sm text-on-surface-variant mb-2">{s.label}</p>
              <p className={`text-4xl font-bold font-sans ${s.color}`}>{s.value}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-on-surface-variant">Unable to load admin stats. Log in as admin.</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold font-sans text-on-surface">Pending Business Approvals</h3>
        </div>
        {pending.length === 0 ? (
          <p className="p-8 text-on-surface-variant text-center">No pending profiles — all caught up.</p>
        ) : (
          <div className="divide-y">
            {pending.map((item) => (
              <div key={item._id} className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div className="flex gap-4 items-center">
                  {item.images?.[0] && (
                    <img src={resolveImageUrl(item.images[0])} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  )}
                  <div>
                    <h4 className="text-label-md text-primary font-bold">{item.name}</h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {item.owner?.name} · {item.category} · {formatDate(item.createdAt)}
                    </p>
                    <p className="text-body-sm text-outline line-clamp-1 max-w-md">{item.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleModerate(item._id, 'reject')} className="px-4 py-2 border-2 border-error text-error rounded-lg text-label-sm font-bold cursor-pointer hover:bg-error/5">
                    Reject
                  </button>
                  <button onClick={() => handleModerate(item._id, 'approve')} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-bold cursor-pointer">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold font-sans text-on-surface">Pending Mentor Applications</h3>
        </div>
        {pendingMentors.length === 0 ? (
          <p className="p-8 text-on-surface-variant text-center">No pending mentors — all caught up.</p>
        ) : (
          <div className="divide-y">
            {pendingMentors.map((item) => (
              <div key={item._id} className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div className="flex gap-4 items-center">
                  {item.image ? (
                    <img src={resolveImageUrl(item.image)} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-surface-variant flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-outline-variant">person</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-label-md text-primary font-bold">{item.fullName}</h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {item.expertise} · {item.experience} yrs exp · {formatDate(item.createdAt)}
                    </p>
                    <p className="text-body-sm text-outline line-clamp-1 max-w-md">Why Join: {item.whyJoin}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleModerateMentor(item._id, 'reject')} className="px-4 py-2 border-2 border-error text-error rounded-lg text-label-sm font-bold cursor-pointer hover:bg-error/5">
                    Reject
                  </button>
                  <button onClick={() => handleModerateMentor(item._id, 'approve')} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-bold cursor-pointer">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
