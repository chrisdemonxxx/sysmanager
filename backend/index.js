// index.js
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const compression = require('compression');
const helmet = require('helmet');
const appRoute = require('./routes');
const webSocket = require('./configs/ws.handler');
const systemMonitor = require('./services/systemMonitor');
const persist = require('./services/persist.service');
const cron = require('node-cron');

// Load environment variables
dotenv.config();
const port = process.env.APP_PORT || 8080;

// Initialize express
const app = express();
const server = http.createServer(app);

// Initialize WebSocket
webSocket.initWebSocketServer(server);
systemMonitor.start(2000);

cron.schedule('*/5 * * * *', persist.persist);

// Middleware
app.use(morgan('tiny'));
app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Windows System Management & Deployment Tool',
  });
});

// Mount versioned API routes
app.use('/api/v1', appRoute); // ✅ this maps to /api/v1/info/get-user-list

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
