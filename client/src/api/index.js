import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/api' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const fetchTransactions = (id) => API.get(`/transactions/${id}`);
export const sendMoney = (transactionData) => API.post('/transactions/send', transactionData);

export const requestOTP = (email) => API.post('/security/request-otp', { email });

export const verifyOTP = (data) => API.post('/security/verify-otp', data);


export const fetchAllTransactions = () => API.get('/admin/transactions');
export const fetchFlaggedTransactions = () => API.get('/admin/transactions/flagged');
export const freezeWallet = (id) => API.patch(`/admin/freeze/${id}`);
export const unfreezeWallet = (id) => API.patch(`/admin/unfreeze/${id}`);

export const updateProfile = (id, formData) => API.patch(`/auth/update/${id}`, formData);
export const updatePassword = (id, password) => API.patch(`/auth/password/${id}`, { password });

export const fetchUsers = (userId) => API.get(`/auth/users?userId=${userId}`);
