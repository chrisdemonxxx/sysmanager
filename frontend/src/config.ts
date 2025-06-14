const isProd = import.meta.env.PROD;

const APP_CONFIG = {
  API_ENDPOINT: isProd
    ? 'https://api.myapp.com/api/v1/'
    : 'http://localhost:8080/api/v1/',
  WEBSOCKET_URL: isProd
    ? 'wss://ws.myapp.com'
    : 'ws://localhost:8080',
};

export default APP_CONFIG;
