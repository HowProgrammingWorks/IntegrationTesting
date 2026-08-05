'use strict';

const http = require('node:http');

const api = {};
const methods = ['startCounter', 'stopCounter'];

const createMethod = (name) => (...args) => {
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: `/api/${name}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject();
        return;
      }
      res.setEncoding('utf8');
      const buffers = [];
      res.on('data', (chunk) => {
        buffers.push(chunk);
      });
      res.on('end', () => {
        const data = Buffer.concat(buffers).toString();
        resolve(JSON.parse(data));
      });
      res.on('error', reject);
    });
    req.end(JSON.stringify(args));
  });
};

for (const method of methods) {
  api[method] = createMethod(method);
}

module.exports = { api };
