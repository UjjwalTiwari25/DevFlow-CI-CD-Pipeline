const { Queue } = require('bullmq');

// MOCK QUEUE SYSTEM TO BYPASS REDIS ISSUES FOR SIMULATION
const EventEmitter = require('events');
const queueEmitter = new EventEmitter();

const pipelineQueue = {
  add: async (name, data) => {
    // Asynchronously trigger the worker logic without blocking the web request
    setTimeout(() => {
      queueEmitter.emit('pipeline-job', { data });
    }, 100);
    return { id: 'mock-job-' + Date.now() };
  }
};

const deploymentQueue = {
  add: async (name, data) => {
    setTimeout(() => {
      queueEmitter.emit('deployment-job', { data });
    }, 100);
    return { id: 'mock-job-' + Date.now() };
  }
};

module.exports = {
  pipelineQueue,
  deploymentQueue,
  connection: {},
  queueEmitter
};
