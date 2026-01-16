const crypto = require('crypto');

function requestContext() {
  return function requestContextMiddleware(req, res, next) {
    const requestId = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    const start = Date.now();
    res.on('finish', () => {
      if (process.env.REQUEST_LOG !== 'true') return;
      const ms = Date.now() - start;
      const status = res.statusCode;
      const url = req.originalUrl || req.url;
      console.log('REQ', { request_id: requestId, method: req.method, url, status, ms });
    });
    next();
  };
}

module.exports = { requestContext };

