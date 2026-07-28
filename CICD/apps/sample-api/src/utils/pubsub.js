const Redis = require('ioredis');
const { connection } = require('./queue');
const { EventEmitter } = require('events');

const redisSubscriber = new Redis(connection);
const redisPublisher = new Redis(connection);
const emitter = new EventEmitter();

// Listen to all events published to "devflow_events"
redisSubscriber.subscribe('devflow_events', (err) => {
  if (err) console.error('Failed to subscribe to devflow_events', err);
});

redisSubscriber.on('message', (channel, message) => {
  if (channel === 'devflow_events') {
    try {
      const data = JSON.parse(message);
      // Emit locally based on userId so only the right connections get it
      if (data.userId) {
        emitter.emit(`user:${data.userId}`, data);
      }
      // Emit globally
      emitter.emit('global', data);
    } catch (e) {
      console.error('Failed to parse pubsub message', e);
    }
  }
});

function publishEvent(userId, eventName, payload) {
  const message = JSON.stringify({ userId, event: eventName, payload });
  redisPublisher.publish('devflow_events', message);
}

module.exports = {
  emitter,
  publishEvent,
};
