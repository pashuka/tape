const { streamEvents } = require("http-event-stream");
const uuid = require("uuid");
// const events = require("./some-event-emitter");

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
    stream(stream) {
      const listener = (counter = 0) => {
        stream.sendEvent({
          id: uuid.v4(),
          event: "message",
          data: JSON.stringify({
            counter,
            now: new Date().toISOString(),
          }),
        });
      };

      // Subscribe to some sample event emitter
      // events.addEventListener("data", listener);
      let counter = 100;
      const t = setInterval(() => {
        listener(counter);
        counter--;
        if (counter === 0) {
          clearInterval(t);
        }
      }, 200);
      // listener(1);
      // Return an unsubscribe function, so the stream can be terminated properly
      const unsubscribe = () => {
        // events.removeEventListener("data", listener);
      };
      return unsubscribe;
    },
  });
};

module.exports = streamTapeEvents;
