import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Welcome!', message: 'Thanks for joining FinWallet. Your account is ready.', timestamp: new Date(), read: false, type: 'info' }
    ]);

    const addNotification = (title, message, type = 'info') => {
        setNotifications(prev => [
            { id: Date.now(), title, message, timestamp: new Date(), read: false, type },
            ...prev
        ]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => setNotifications([]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
