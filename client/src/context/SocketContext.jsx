import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {}

    // Initialize socket
    const SOCKET_URL = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
      : '';
      
    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
    });

    setSocket(newSocket);

    if (userInfo && userInfo._id) {
      newSocket.emit('join', userInfo._id);
    }

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
