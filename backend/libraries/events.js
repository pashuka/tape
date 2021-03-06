const { streamEvents } = require("http-event-stream");
const uuid = require("uuid");
const { subscriber } = require("./ioredis");
const knex = require("./knex");
const { tryParseJSON } = require("./utils");
const { tapeEvents, tables } = require("../constants");

let clientPool = [];

const listener = (id, event, data) => {
  clientPool.forEach(({ user_id, streamContext }) => {
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
  clientPool.forEach(({ streamContext }) =>
    streamContext.sendEvent({
      id: uuid.v4(),
      event,
      data,
    })
  );
};

process.on("cleanup", () => {
  clientPool.forEach(({ streamContext }) => streamContext.close());
  clientPool = [];
});

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
      const { dialog, members } = data;
      members.forEach((id) => {
        listener(id, channel, JSON.stringify(dialog));
      });
      break;

    case tapeEvents.dialog_member_removed:
      break;

    case tapeEvents.message_created:
    case tapeEvents.message_changed:
    case tapeEvents.message_removed:
      const { dialog_id } = data;
      const dialogMembers = await knex(tables.members)
        .select("user_id")
        // TODO: Select only where {members.settings.mute: false} or members.settings.mute: null} in case of push notifications. Maybe send notification anyway but with mute sound/vibrate alerts, without display screen notification.
        .where({ dialog_id });
      if (dialogMembers) {
        dialogMembers.map(({ user_id }) => {
          listener(user_id, channel, message);
        });
      }
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
      {
        id: uuid.v4(),
        event: "event-since",
        data: uuid.v4(),
      },
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
      clientPool.push({
        stream_id,
        user_id,
        streamContext,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Count subscribers:", clientPool.length);
      }

      // Return an unsubscribe function, so the stream can be terminated properly
      return () => {
        // clean pool
        clientPool = clientPool.filter(
          (_) => !(stream_id === _.stream_id && user_id === _.user_id)
        );
      };
    },
  });
};

module.exports = streamTapeEvents;
