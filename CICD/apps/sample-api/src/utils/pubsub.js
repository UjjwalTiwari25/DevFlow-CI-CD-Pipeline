const { EventEmitter } = require('events');

const emitter = new EventEmitter();

function publishEvent(userId, eventName, payload) {
  // In mock simulation mode without Redis, emit directly to local connections.
  const data = { userId, event: eventName, payload };
  
  if (data.userId) {
    emitter.emit(`user:${data.userId}`, data);
  }
  emitter.emit('global', data);
}

module.exports = {
  emitter,
  publishEvent,
};
