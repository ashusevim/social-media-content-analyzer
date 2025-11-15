const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const analyzeRouter = require('./routes/analyze');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandlers');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/analyze', analyzeRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
