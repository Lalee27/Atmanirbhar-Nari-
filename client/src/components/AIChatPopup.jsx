import React, { useState } from 'react';
import { chatWithGemini } from '../services/api';

const AIChatPopup = ({ isOpen, onClose }) => {
  let userInfo = {};
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  } catch (e) {
    userInfo = {};
  }

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am **Nari Shakti AI**, your Google Gemini-powered Business Assistant. 🌸\n\nHow can I help you grow your business today?`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleSendChatMessage = async (e, customText = '') => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setChatLoading(true);

    try {
      const response = await chatWithGemini({
        message: textToSend,
        history: chatMessages.slice(-8)
      });
      const assistantMsg = { sender: 'assistant', text: response.data.reply };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue connecting to the Gemini server.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[#F7F5F0] w-[92vw] sm:w-[380px] h-[70vh] sm:h-[550px] max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-fade-in-up border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-5 py-4 flex items-center border-b border-black/5 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-black text-sm">Nari Shakti AI</h3>
              <p className="text-[10px] text-gray-500 font-semibold">Gemini Active</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-500 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {chatMessages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={index} className={`flex gap-2 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm flex-shrink-0 ${
                  isUser ? 'bg-amber-500 text-white' : 'bg-black text-white'
                }`}>
                  {isUser ? getInitials(userInfo?.name) : 'AI'}
                </div>
                <div className={`p-3 rounded-2xl text-[13px] leading-relaxed ${
                  isUser 
                    ? 'bg-black text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-black/5 shadow-sm'
                }`}>
                  {msg.text.split('\n').map((line, i) => {
                    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return <p key={i} className={i !== 0 ? 'mt-1' : ''} dangerouslySetInnerHTML={{ __html: bold }} />;
                  })}
                </div>
              </div>
            );
          })}
          {chatLoading && (
            <div className="flex gap-2 max-w-[80%] mr-auto items-center animate-pulse">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                AI
              </div>
              <div className="bg-white text-gray-500 border border-black/5 p-3 rounded-2xl rounded-tl-none text-[11px] font-semibold shadow-sm">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-black/5">
          {chatMessages.length === 1 && (
            <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
              {['Pricing ideas', 'Marketing tips', 'Write an email'].map((p, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSendChatMessage(e, p)}
                  className="whitespace-nowrap px-3 py-1.5 bg-black/5 hover:bg-black text-black hover:text-white font-semibold text-[10px] rounded-lg cursor-pointer transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 h-10 px-4 rounded-xl bg-[#F7F5F0] border border-black/5 focus:border-black/20 outline-none transition-all text-sm text-black"
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="h-10 w-10 flex items-center justify-center bg-black text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatPopup;
