import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Correctly parse the stored profile and set the user state
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('profile');
        if (stored) {
            try {
                return JSON.parse(stored).user;
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = (user, token) => {
        // Save both user and token as an object in localStorage
        const profile = { user, token };
        localStorage.setItem('profile', JSON.stringify(profile));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('profile');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
