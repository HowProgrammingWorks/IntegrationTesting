'use strict';

module.exports = async name => {
  try {
    await api.scheduler.stop(name);
  } catch (err) {
    return `Task ${name} can't be stopped`;
  }
  return `Task ${name} stopped`;
};
