import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Get current user from localStorage or default
const getCurrentUsername = () => {
  return localStorage.getItem('currentUser') || 'default';
};

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add username and JWT token headers to all requests
api.interceptors.request.use((config) => {
  config.headers['X-Username'] = getCurrentUsername();

  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Pokemon APIs
export const getAllPokemons = async (limit = 151, offset = 0) => {
  const response = await api.get(`/pokemon/list?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonById = async (id) => {
  const response = await api.get(`/pokemon/${id}`);
  return response.data;
};

export const catchPokemon = async () => {
  const response = await api.post('/pokemon/catch');
  return response.data;
};

export const getCatchStatus = async () => {
  const response = await api.get('/pokemon/catch/status');
  return response.data;
};

export const getCaughtPokemons = async () => {
  const response = await api.get('/pokemon/caught');
  return response.data;
};

// User APIs
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserPokemon = async (username) => {
  const response = await api.get(`/users/${username}/pokemon`);
  return response.data;
};

export const setCurrentUser = (username) => {
  localStorage.setItem('currentUser', username);
};

export const getCurrentUser = () => {
  return getCurrentUsername();
};

// Trade APIs
export const offerTrade = async (offeredPokemonId, requestedPokemonId, receiverUsername) => {
  const response = await api.post('/trades/offer', {
    offeredPokemonId,
    requestedPokemonId,
    receiverUsername,
  });
  return response.data;
};

export const acceptTrade = async (tradeId) => {
  const response = await api.post(`/trades/${tradeId}/accept`);
  return response.data;
};

export const rejectTrade = async (tradeId) => {
  const response = await api.post(`/trades/${tradeId}/reject`);
  return response.data;
};

export const cancelTrade = async (tradeId) => {
  const response = await api.post(`/trades/${tradeId}/cancel`);
  return response.data;
};

export const getPendingTrades = async () => {
  const response = await api.get('/trades/pending');
  return response.data;
};

export const getAllTrades = async () => {
  const response = await api.get('/trades');
  return response.data;
};

// Auth APIs
export const login = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password,
  });
  if (response.data.success) {
    localStorage.setItem('currentUser', response.data.user.username);
    localStorage.setItem('userDisplayName', response.data.user.displayName);
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const register = async (username, displayName, password) => {
  const response = await api.post('/auth/register', {
    username,
    displayName,
    password,
  });
  if (response.data.success) {
    localStorage.setItem('currentUser', response.data.user.username);
    localStorage.setItem('userDisplayName', response.data.user.displayName);
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userDisplayName');
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return localStorage.getItem('currentUser') !== null;
};

export const getUserDisplayName = () => {
  return localStorage.getItem('userDisplayName') || '';
};
