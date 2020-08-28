const { streamEvents } = require("http-event-stream");
const uuid = require("uuid");
const { subscriber } = require("./ioredis");
const knex = require("./knex");
const { tryParseJSON } = require("./utils");
const { tapeEvents, tables } = require("../constants");
const { user } = require("../models/messages");

let pool = [];

const listener = (id, event, data) => {
  pool.forEach(({ user_id, streamContext }) => {
    if (user_id === id) {
      streamContext.sendEvent({
        id: uuid.v4(),
        event,
        data,
      });
    }
  });
};

const broadcast = (event, data) => {
  pool.forEach(({ streamContext }) =>
    streamContext.sendEvent({
      id: uuid.v4(),
      event,
      data,
    })
  );
};

subscriber.on("message", async (channel, message) => {
  const data = tryParseJSON(message);
  switch (channel) {
    case tapeEvents.dialog_changed:
      const { user_id } = data;
      listener(user_id, channel, message);
      break;

    case tapeEvents.dialog_member_changed:
      break;

    case tapeEvents.dialog_member_created:
      break;

    case tapeEvents.dialog_member_removed:
      break;

    case tapeEvents.message_created:
      const { dialog_id } = data;
      const dialogMembers = await knex(tables.members)
        .select("user_id")
        // TODO: select only where {members.settings.mute: false} or members.settings.mute: null}
        .where({ dialog_id });
      if (dialogMembers) {
        dialogMembers.map(({ user_id }) => {
          listener(user_id, channel, message);
        });
      }
      break;

    case tapeEvents.message_changed:
      break;
    case tapeEvents.message_removed:
      break;

    case tapeEvents.user_info_changed:
      const isFriend = true;
      if (isFriend) {
        broadcast(channel, message);
      }
      break;
    case tapeEvents.user_online:
      break;
    case tapeEvents.user_offline:
      break;
    case tapeEvents.user_typing:
      break;

    default:
      break;
  }
});

const streamTapeEvents = (req, res) => {
  const fetchEventsSince = async (lastEventId) => {
    return [
      /* all events since event with ID `lastEventId` would go here */
    ];
  };

  const stream_id = uuid.v4();
  const user_id = req.user.id;

  return streamEvents(req, res, {
    async fetch(lastEventId) {
      // This method is mandatory to replay missed events after a re-connect
      return fetchEventsSince(lastEventId);
    },
    stream(streamContext) {
      pool.push({
        stream_id,
        user_id,
        streamContext,
      });

      // Return an unsubscribe function, so the stream can be terminated properly
      return () => {
        // clean pool
        pool = pool.filter((_) => !(stream_id === _.stream_id && user_id === _.user_id));
      };
    },
  });
};

module.exports = streamTapeEvents;
