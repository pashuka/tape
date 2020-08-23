const config = require("../.env").redis;
const Redis = require("ioredis");
const { tapeEvents } = require("../constants");

const subscribedInstance = () => {
  const instance = new Redis(config);

  instance.subscribe(Object.values(tapeEvents), (err) => {
    if (err) {
      console.error("ioredis subscribe error", err);
    }
  });
  return instance;
};

exports.subscriber = subscribedInstance();

const publisherInstance = () => {
  return new Redis(config);
};

exports.publisher = publisherInstance();
