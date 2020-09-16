const config = require("../.env").rabbitmq;
const amqp = require("amqplib");

(async () => {
  try {
    const conn = await amqp.connect(config.uri);
    const channel = await conn.createChannel();

    let { queue, messageCount } = await channel.assertQueue(config.queue, {
      durable: true,
    });

    if (config.prefetch) {
      await channel.prefetch(config.prefetch);
    }

    await channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          await worker(msg, (toAcknowledge = false) => {
            if (
              msg.fields.deliveryTag == config.prefetch ||
              msg.fields.deliveryTag == messageCount
            ) {
              preventConsume = true;
              delayDone(3000, "Done: deliveryTag " + msg.fields.deliveryTag);
            }
            if (!!toAcknowledge) {
              channel.ack(msg);
            }
          });
        }
      },
      {
        // noAck: false,
        // Defaults to false, if true, the broker won’t expect an
        // acknowledgement of messages delivered to this consumer;
        // i.e., it will dequeue messages as soon as they’ve been sent down the wire.
      }
    );
    // await channel.close();
    // await conn.close();
  } catch (e) {
    console.error(e);
  }
})();
