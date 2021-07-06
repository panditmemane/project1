import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

const apiClient = () => {
  const instance = axios.create({
    baseURL,
  });

  // Obtain the fresh token each time the function is called
  function getAccessToken() {
    return localStorage.getItem('token');
  }

  // Use interceptor to inject the token to requests
  instance.interceptors.request.use((request) => {
    request.headers['Content-Type'] = 'application/json';
    if (getAccessToken()) {
      request.headers.Authorization = `Token ${getAccessToken()}`;
    }
    return request;
  });

  return instance;
};

export default apiClient;
