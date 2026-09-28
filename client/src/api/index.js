import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'http://localhost:5000/api' });
// const axiosInstance = axios.create({ baseURL: 'https://xyzdisplays-po-app.onrender.com/api' });

/** Local Outlook helper installed on each Windows PC (see /outlook-helper) */
export const OUTLOOK_HELPER_URL = 'http://127.0.0.1:17890';

export const getOrder = id => axiosInstance.get(`/orders/${id}`);

export const saveOrder = data => axiosInstance.post('/orders', data);

export const getProductById = id => axiosInstance.get(`/products${id}`);

export const saveOption = option => axiosInstance.post(`/option`, option);

export const saveOptionsFile = (options) => axiosInstance.post('/option/save-options-file', options);

export const getOptions = () => axiosInstance.get('/option');

// for future
export const getOptionById = id => axiosInstance.get(`/option${id}`);

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
