const { streamEvents } = require("http-event-stream");
const uuid = require("uuid");
const { subscriber } = require("./ioredis");
const knex = require("./knex");
const { tryParseJSON } = require("./utils");
const { tapeEvents, tables } = require("../constants");

const streamTapeEvents = (req, res) => {
  const fetchEventsSince = async (lastEventId) => {
    return [
      /* all events since event with ID `lastEventId` would go here */
    ];
  };
  return streamEvents(req, res, {
    async fetch(lastEventId) {
      // This method is mandatory to replay missed events after a re-connect
      return fetchEventsSince(lastEventId);
    },
    stream(streamContext) {
      const listener = (event, data) => {
        streamContext.sendEvent({
          id: uuid.v4(),
          event,
          data,
        });
      };
      subscriber.on("message", async (channel, message) => {
        const data = tryParseJSON(message);
        switch (channel) {
          case tapeEvents.message:
            const user_id = req.user.id;
            const { dialog_id } = data;
            const isMember = await knex(tables.members)
              .select("dialog_id")
              .where({ dialog_id, user_id })
              .first();
            if (isMember) {
              listener(channel, message);
            }
            break;

          default:
            break;
        }
      });

      // Return an unsubscribe function, so the stream can be terminated properly
      const unsubscribe = () => {
        // events.removeEventListener("data", listener);
      };
      return unsubscribe;
    },
  });
};

module.exports = streamTapeEvents;
