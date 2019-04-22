'use strict';

module.exports = async (name, timeout) => {
  console.log('task', name, timeout);
  return 'ok';
};
