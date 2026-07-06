import React, { useState, useEffect } from 'react';
import { getMentorAdvice } from '../services/api';

const CATEGORIES = [
  'Tiffin Services',
  'Tailoring & Fashion',
  'Beauty & Wellness',
  'Handicrafts',
  'Tuition & Coaching',
];

const TOPICS = [
  { id: 'setup-costs', label: 'Setup & Costs', icon: 'account_balance_wallet' },
  { id: 'licensing', label: 'Licensing', icon: 'gavel' },
  { id: 'pricing', label: 'Pricing', icon: 'sell' },
  { id: 'all', label: 'Full Plan', icon: 'lightbulb' },
];

const BusinessMentor = () => {
  const [category, setCategory] = useState('Tiffin Services');
  const [topic, setTopic] = useState('all');
  const [message, setMessage] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const askMentor = async () => {
    setLoading(true);
    try {
      const { data } = await getMentorAdvice({ category, topic, message });
      setAdvice(data.advice);
      setHistory((prev) => [
        { category, topic, question: message || TOPICS.find((t) => t.id === topic)?.label, advice: data.advice },
        ...prev.slice(0, 4),
      ]);
    } catch {
      setAdvice('Unable to fetch advice. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    askMentor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, topic]);

  const formatAdvice = (text) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p
          key={i}
          className="text-body-md text-on-surface-variant leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: bold }}
        />
      );
    });

  return (
    <div className="max-w-[1240px] mx-auto px-4 lg:px-8 py-8 mt-4 relative">
      <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div>
            <h1 className="text-headline-lg text-primary font-bold">
              AI <span className="text-gradient-primary font-black">Business Mentor</span>
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1 leading-relaxed">
              Personalized guidance on setup costs, licensing, and pricing for your service category.
            </p>
          </div>

          <div className="premium-card p-5 rounded-2xl">
            <label className="text-label-lg font-semibold text-on-surface block mb-3">Your business type</label>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-left px-4 py-3 rounded-xl text-label-md transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm scale-[1.02]'
                      : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="premium-card p-5 rounded-2xl">
            <label className="text-label-lg font-semibold text-on-surface block mb-3">Focus area</label>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTopic(t.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-label-sm cursor-pointer transition-all ${
                    topic === t.id 
                      ? 'bg-primary text-white font-semibold shadow-md' 
                      : 'text-on-surface-variant bg-surface-container-low border border-outline-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="premium-card p-6 rounded-2xl min-h-[320px] shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-outline-variant">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <div>
                <h2 className="text-headline-md font-semibold text-on-surface">Mentor Response</h2>
                <p className="text-label-md text-on-surface-variant">{category}</p>
              </div>
            </div>
            {loading ? (
              <p className="text-on-surface-variant animate-pulse leading-relaxed font-semibold">Analyzing your business context...</p>
            ) : (
              <div className="space-y-1">{formatAdvice(advice)}</div>
            )}
          </div>

          <div className="premium-card p-6 rounded-2xl">
            <label className="text-label-lg font-semibold text-on-surface block mb-3">
              Ask a specific question (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="e.g., How much should I charge for monthly tiffin subscriptions?"
              className="w-full p-4 rounded-xl border-2 border-outline-variant focus:border-secondary outline-none text-body-md resize-none mb-4 bg-surface-container-lowest"
            />
            <button
              type="button"
              onClick={askMentor}
              disabled={loading}
              className="px-8 py-3.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60 cursor-pointer btn-hover-lift shadow-md"
            >
              Get Personalized Advice
            </button>
            <p className="text-label-sm text-outline mt-3 leading-relaxed">
              Educational guidance only — consult local authorities and a CA for legal and tax matters.
            </p>
          </div>

          {history.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-headline-sm text-primary font-semibold">Recent sessions</h3>
              {history.slice(1).map((h, i) => (
                <div key={i} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                  <p className="text-label-md text-secondary font-semibold">{h.category} · {h.question}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BusinessMentor;
