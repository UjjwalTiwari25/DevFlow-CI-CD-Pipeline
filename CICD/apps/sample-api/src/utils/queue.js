const { Queue } = require('bullmq');

const connection = {
  host: '127.0.0.1',
  port: 16379,
};

const pipelineQueue = new Queue('pipeline-queue', { connection });

module.exports = {
  pipelineQueue,
  connection,
};
