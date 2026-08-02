import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, markMessagesRead, resolveImageUrl } from '../services/api';
import { useSocket } from '../context/SocketContext';

const ChatBox = ({ inquiry, currentUser, otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    fetchMessages();
  }, [inquiry._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.inquiry === inquiry._id) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        if (message.sender._id !== currentUser._id) {
          markMessagesRead(inquiry._id).catch(console.error);
        }
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, inquiry._id, currentUser._id]);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages(inquiry._id);
      setMessages(data);
      // mark as read
      await markMessagesRead(inquiry._id);
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await sendMessage({
        inquiryId: inquiry._id,
        receiverId: otherUser._id,
        text: newMessage
      });
      // The socket event might arrive before the response or we can manually append it
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md h-[600px] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <img 
              src={resolveImageUrl(otherUser.profilePicture) || 'https://via.placeholder.com/150'} 
              alt={otherUser.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
            />
            <div>
              <h3 className="font-bold text-gray-900">{otherUser.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{otherUser.role}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">forum</span>
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender._id === currentUser._id;
              return (
                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMine 
                        ? 'bg-primary text-white rounded-br-sm shadow-md shadow-primary/20' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 text-gray-800 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border-transparent transition-shadow"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
