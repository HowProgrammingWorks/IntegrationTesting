'use strict';

module.exports = async name => {
  scheduler.stop(name);
  console.log(`Counter ${name} is stopped`);
  return 'ok';
};
