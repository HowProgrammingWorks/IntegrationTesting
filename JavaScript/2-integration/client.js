'use strict';

const http = require('http');
const { EventEmitter } = require('events');

class Scheduler extends EventEmitter {
  task(/*name, time, exec*/) {}
  stop(/*name*/) {}
  stopAll() {}
}

const methods = Object.getOwnPropertyNames(Scheduler.prototype);

for (const method of methods) {
  Scheduler.prototype[method] = (...args) => new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8000,
      path: `/api/${method}`,
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
      res.on('end', () => resolve(buffer.join()));
    });
    req.end(JSON.stringify(args));
  });
}

const scheduler = new Scheduler();

const scenario = async () => {
  await scheduler.task('name1', () => {});
  await scheduler.stop('name1');
};

scenario();
