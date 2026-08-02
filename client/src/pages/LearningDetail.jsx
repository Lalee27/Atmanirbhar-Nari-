import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningResourceById } from '../services/api';

const LearningDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await getLearningResourceById(id);
        setModule(data);
      } catch (err) {
        setError('Failed to load learning resource.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) {
    return <div className="page-container text-center py-20 font-bold text-gray-500">Loading module details...</div>;
  }

  if (error || !module) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-error font-bold mb-4">{error || 'Resource not found'}</p>
        <button onClick={() => navigate('/learning')} className="text-primary hover:underline">Back to Learning Hub</button>
      </div>
    );
  }

  const isWorkshop = module.category?.toLowerCase().includes('workshop');

  return (
    <div className="page-container flex justify-center py-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
        
        {/* Header/Hero */}
        <div className="relative aspect-[21/9] w-full bg-black/5">
          {module.videoUrl && !isWorkshop ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={module.videoUrl} 
              title={module.title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full object-cover"
            ></iframe>
          ) : (
            <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
          )}
          
          <button
            onClick={() => navigate('/learning')}
            className="absolute top-4 left-4 bg-white/80 backdrop-blur text-black p-2 rounded-full hover:bg-white hover:scale-105 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-lg block">arrow_back</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-4">
            <span className="text-primary text-label-md font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
              {module.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{module.title}</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {module.description || module.desc}
          </p>

          <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">menu_book</span>
              What you will learn
            </h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                <span>Introduction to {module.title} and core concepts.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                <span>Best-practices and planning strategies.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">radio_button_unchecked</span>
                <span>Interactive Case Study & Live Assessment.</span>
              </li>
            </ul>
          </div>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
            {isWorkshop ? (
              registered ? (
                <div className="flex-1 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-center">
                  <span className="material-symbols-outlined">check_circle</span>
                  Registered successfully! Check your email.
                </div>
              ) : (
                <button
                  onClick={() => setRegistered(true)}
                  className="flex-1 btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  Register for Workshop
                </button>
              )
            ) : (
              <button
                onClick={() => {
                  alert(`Starting course: ${module.title}`);
                }}
                className="flex-1 btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Start Learning <span className="material-symbols-outlined">play_arrow</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDetail;
