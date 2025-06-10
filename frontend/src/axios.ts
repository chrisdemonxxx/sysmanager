import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import APP_CONFIG from './config';

interface RequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any> | FormData;
  headers?: Record<string, string>;
}

const request = async ({
  url,
  method,
  data,
  headers,
}: RequestOptions): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    method,
    url: APP_CONFIG.API_ENDPOINT + url,
    headers: {
      ...headers,
    },
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    if (data instanceof FormData) {
      config.data = data;
    } else {
      config.data = JSON.stringify(data);
      config.headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.error('[API ERROR]', error?.response?.data || error.message);
    throw error;
  }
};

export default request;
