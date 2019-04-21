'use strict';

const { EventEmitter } = require('events');
const { Logger } = require('./logger.js');

class Task extends EventEmitter {
  constructor(name, time, exec) {
    super();
    this.name = name;
    if (typeof time === 'number') {
      this.time = Date.now() + time;
      this.set = setInterval;
      this.clear = clearInterval;
    } else {
      this.time = new Date(time).getTime();
      this.set = setTimeout;
      this.clear = clearTimeout;
    }
    this.exec = exec;
    this.running = false;
    this.count = 0;
    this.timer = null;
  }
  get active() {
    return !!this.timer;
  }
  start() {
    this.stop();
    if (this.running) return false;
    const time = this.time - Date.now();
    if (time < 0) return false;
    this.timer = this.set(() => {
      this.run();
    }, time);
    return true;
  }
  stop() {
    if (!this.active || this.running) return false;
    this.clear(this.timer);
    this.timer = null;
    return true;
  }
  run() {
    if (!this.active || this.running) return false;
    this.running = true;
    this.exec(err  => {
      if (err) this.emit('error', err, this);
      this.count++;
      this.running = false;
    });
    return true;
  }
}

class Scheduler extends EventEmitter {
  constructor() {
    super();
    this.tasks = new Map();
    this.logger = new Logger();
  }
  task(name, time, exec) {
    this.stop(name);
    const task = new Task(name, time, exec);
    this.tasks.set(name, task);
    task.on('error', err => {
      this.emit('error', err, task);
    });
    task.start();
    return task;
  }
  stop(name) {
    const task = this.tasks.get(name);
    if (task) {
      task.stop();
      this.tasks.delete(name);
    }
  }
  stopAll() {
    for (const name of this.tasks.keys()) {
      this.stop(name);
    }
  }
}

module.exports = { Scheduler };
