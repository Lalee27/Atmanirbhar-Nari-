import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminStats, getPendingBusinesses, moderateBusiness, resolveImageUrl, 
  getPendingMentors, moderateMentor,
  getReports, updateReportStatus,
  getLearningResources, createLearningResource, updateLearningResource, deleteLearningResource
} from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Approvals');
  
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  
  const [reports, setReports] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Form states for Learning Resources
  const [showLearningForm, setShowLearningForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [learningForm, setLearningForm] = useState({
    title: '', category: '', description: '', image: '', videoUrl: '', actionText: 'Watch Video', icon: 'play_circle', pills: ''
  });

  const load = async () => {
    try {
      const [statsRes, pendingRes, mentorsRes, reportsRes, learningRes] = await Promise.all([
        getAdminStats(), 
        getPendingBusinesses(),
        getPendingMentors(),
        getReports({ limit: 50 }),
        getLearningResources()
      ]);
      setStats(statsRes.data);
      setPending(pendingRes.data.businesses || []);
      setPendingMentors(mentorsRes.data.mentors || []);
      setReports(reportsRes.data.reports || []);
      setLearningResources(learningRes.data || []);
    } catch {
      setStats(null);
      setPending([]);
      setPendingMentors([]);
      setReports([]);
      setLearningResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
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
    } catch {}
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
    } catch {}
  };

  const handleReportStatus = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      setReports(reports.map(r => r._id === id ? { ...r, status } : r));
    } catch (error) {
      alert('Failed to update report status');
    }
  };

  const handleLearningSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...learningForm,
      pills: learningForm.pills.split(',').map(p => p.trim()).filter(Boolean)
    };
    try {
      if (editingResource) {
        const { data } = await updateLearningResource(editingResource._id, payload);
        setLearningResources(learningResources.map(r => r._id === editingResource._id ? data : r));
      } else {
        const { data } = await createLearningResource(payload);
        setLearningResources([data, ...learningResources]);
      }
      setShowLearningForm(false);
      setEditingResource(null);
      setLearningForm({ title: '', category: '', description: '', image: '', videoUrl: '', actionText: 'Watch Video', icon: 'play_circle', pills: '' });
    } catch (error) {
      alert('Failed to save learning resource');
    }
  };

  const handleDeleteLearning = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteLearningResource(id);
        setLearningResources(learningResources.filter(r => r._id !== id));
      } catch (error) {
        alert('Failed to delete resource');
      }
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
        <h1 className="text-3xl text-primary font-bold font-sans">Admin Dashboard</h1>
        <p className="text-body-lg text-on-surface-variant mt-2">Manage approvals, reports, and platform learning content.</p>
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

      <div className="flex border-b">
        {['Approvals', 'Reports', 'Learning Content'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-label-lg transition-colors border-b-2 ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Approvals' && (
        <div className="space-y-8">
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
                      <button onClick={() => handleModerate(item._id, 'reject')} className="px-4 py-2 border-2 border-error text-error rounded-lg text-label-sm font-bold cursor-pointer hover:bg-error/5">Reject</button>
                      <button onClick={() => handleModerate(item._id, 'approve')} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-bold cursor-pointer">Approve</button>
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
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleModerateMentor(item._id, 'reject')} className="px-4 py-2 border-2 border-error text-error rounded-lg text-label-sm font-bold cursor-pointer hover:bg-error/5">Reject</button>
                      <button onClick={() => handleModerateMentor(item._id, 'approve')} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-bold cursor-pointer">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold font-sans text-on-surface">User Reports & Complaints</h3>
          </div>
          {reports.length === 0 ? (
            <p className="p-8 text-on-surface-variant text-center">No reports found.</p>
          ) : (
            <div className="divide-y">
              {reports.map(report => (
                <div key={report._id} className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-start">
                  <div>
                    <span className="text-label-sm font-bold text-error uppercase tracking-wider">{report.type}</span>
                    <h4 className="text-label-lg font-bold text-on-surface mt-1">
                      Reporter: {report.reporter?.name || 'Unknown'}
                    </h4>
                    {report.targetBusiness && (
                      <p className="text-body-sm text-secondary font-semibold">Target: {report.targetBusiness?.name}</p>
                    )}
                    <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl bg-surface-container-low p-3 rounded-md">
                      "{report.description}"
                    </p>
                    <p className="text-label-sm text-outline mt-2">{formatDate(report.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <select 
                      value={report.status}
                      onChange={(e) => handleReportStatus(report._id, e.target.value)}
                      className={`p-2 rounded-lg text-label-sm font-bold border ${
                        report.status === 'Open' ? 'bg-error/10 text-error border-error/20' :
                        report.status === 'In Progress' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Learning Content' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold font-sans text-on-surface">Manage Learning Hub</h3>
            <button 
              onClick={() => {
                setShowLearningForm(true);
                setEditingResource(null);
                setLearningForm({ title: '', category: '', description: '', image: '', videoUrl: '', actionText: 'Watch Video', icon: 'play_circle', pills: '' });
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg text-label-md font-bold hover:opacity-90"
            >
              + Add Resource
            </button>
          </div>
          
          {showLearningForm && (
            <div className="p-6 bg-surface-container-low border-b">
              <h4 className="font-bold text-lg mb-4">{editingResource ? 'Edit Resource' : 'New Resource'}</h4>
              <form onSubmit={handleLearningSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Title" value={learningForm.title} onChange={e => setLearningForm({...learningForm, title: e.target.value})} className="p-3 rounded-lg border w-full" />
                <input required placeholder="Category (e.g., Marketing)" value={learningForm.category} onChange={e => setLearningForm({...learningForm, category: e.target.value})} className="p-3 rounded-lg border w-full" />
                <textarea required placeholder="Description" value={learningForm.description} onChange={e => setLearningForm({...learningForm, description: e.target.value})} className="p-3 rounded-lg border w-full md:col-span-2" />
                <input required placeholder="Image URL" value={learningForm.image} onChange={e => setLearningForm({...learningForm, image: e.target.value})} className="p-3 rounded-lg border w-full" />
                <input placeholder="Video URL (YouTube Embed Link)" value={learningForm.videoUrl} onChange={e => setLearningForm({...learningForm, videoUrl: e.target.value})} className="p-3 rounded-lg border w-full" />
                <input placeholder="Tags/Pills (comma separated)" value={learningForm.pills} onChange={e => setLearningForm({...learningForm, pills: e.target.value})} className="p-3 rounded-lg border w-full md:col-span-2" />
                <div className="md:col-span-2 flex gap-3 mt-2">
                  <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Save</button>
                  <button type="button" onClick={() => setShowLearningForm(false)} className="px-6 py-2 border rounded-lg font-bold">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="divide-y">
            {learningResources.map(resource => (
              <div key={resource._id} className="p-6 flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <img src={resource.image} alt="" className="w-24 h-16 object-cover rounded-lg border" />
                  <div>
                    <h4 className="text-label-lg font-bold text-on-surface">{resource.title}</h4>
                    <span className="text-label-sm text-secondary font-bold">{resource.category}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      setEditingResource(resource);
                      setLearningForm({
                        ...resource,
                        pills: (resource.pills || []).join(', ')
                      });
                      setShowLearningForm(true);
                    }}
                    className="px-3 py-1 bg-surface-container border rounded-lg text-label-sm font-bold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteLearning(resource._id)}
                    className="px-3 py-1 bg-error/10 text-error border-error/20 border rounded-lg text-label-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {learningResources.length === 0 && !showLearningForm && (
              <p className="p-8 text-center text-on-surface-variant">No learning resources added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
