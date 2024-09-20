import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'http://localhost:5000/api' });
// const axiosInstance = axios.create({ baseURL: 'https://xyzdisplays-po-app.onrender.com/api' });


export const getOrder = id => axiosInstance.get(`/orders/${id}`);

export const saveOrder = data => axiosInstance.post('/orders', data);

export const getProductById = id => axiosInstance.get(`/products${id}`);

export const saveOption = option => axiosInstance.post(`/option`, option);

export const getOptions = () => axiosInstance.get('/option');

// for future
export const getOptionById = id => axiosInstance.get(`/option${id}`);

