import axios from 'axios';

const TOKEN_KEY = 'authToken';
const LOGIN_KEY = 'login';
const LOGGED_IN_KEY = 'isLoggedIn';

export const API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://xyzdisplays-po-app-version-2-1.onrender.com';

const axiosInstance = axios.create({ baseURL: `${API_BASE_URL}/api` });

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGGED_IN_KEY);
  localStorage.removeItem(LOGIN_KEY);
}

export function setAuthSession({ token, login }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LOGGED_IN_KEY, 'true');
  if (login) {
    localStorage.setItem(LOGIN_KEY, login);
  }
}

function attachAuthHeader(config) {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function handleUnauthorized(error) {
  if (error?.response?.status === 401) {
    clearAuth();
    if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }
  return Promise.reject(error);
}

// Shared instance used by api helpers
axiosInstance.interceptors.request.use(attachAuthHeader);
axiosInstance.interceptors.response.use((res) => res, handleUnauthorized);

// Global axios — covers OrderFreight / AddProductPopUp raw calls
axios.interceptors.request.use(attachAuthHeader);
axios.interceptors.response.use((res) => res, handleUnauthorized);

export const loginRequest = (login, password) =>
  axiosInstance.post('/auth/login', { login, password });

export const verifySession = () => axiosInstance.get('/auth/me');

/** Local Outlook helper installed on each Windows PC (see /outlook-helper) */
export const OUTLOOK_HELPER_URL = 'http://127.0.0.1:17890';

export const getOrder = (id) => axiosInstance.get(`/orders/${id}`);

export const saveOrder = (data) => axiosInstance.post('/orders', data);

export const getProductById = (id) => axiosInstance.get(`/products${id}`);

export const saveOption = (option) => axiosInstance.post(`/option`, option);

export const saveOptionsFile = (options) =>
  axiosInstance.post('/option/save-options-file', options);

export const getOptions = () => axiosInstance.get('/option');

// for future
export const getOptionById = (id) => axiosInstance.get(`/option${id}`);

/**
 * Ask the local Outlook helper to open a draft.
 * Requires outlook-helper running on the user's PC.
 */
export async function openOutlookDraft({ to, subject, html }) {
  const response = await fetch(`${OUTLOOK_HELPER_URL}/create-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // ignore non-JSON
  }

  if (!response.ok || data?.ok === false) {
    const message =
      data?.error ||
      `Outlook helper error (${response.status}). Is Start-OutlookHelper.bat running?`;
    throw new Error(message);
  }

  return data;
}

export async function checkOutlookHelper() {
  const response = await fetch(`${OUTLOOK_HELPER_URL}/health`, { method: 'GET' });
  if (!response.ok) {
    throw new Error('Outlook helper is not healthy');
  }
  return response.json();
}
