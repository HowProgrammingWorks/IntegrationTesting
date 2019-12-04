'use strict';

const http = require('http');

const api = {};
const methods = ['startCounter', 'stopCounter'];

const createMethod = name => (...args) => new Promise((resolve, reject) => {
  const req = http.request({
    hostname: 'localhost',
    port: 8000,
    path: `/api/${name}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, res => {
    if (res.statusCode !== 200) {
      reject();
      return;
    }
    res.setEncoding('utf8');
    const buffer = [];
    res.on('data', chunk => buffer.push(chunk));
    res.on('end', () => resolve(JSON.parse(buffer.join())));
  });
  req.end(JSON.stringify(args));
});

for (const method of methods) {
  api[method] = createMethod(method);
}

module.exports = { api };
