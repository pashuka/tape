const router = require("koa-router")();
// const events = require("events");
// const PassThrough = require("stream").PassThrough;
// const Auth = require("../../middlewares/auth");
// const { checkPerms } = require("../../libraries/accesscontrol");
// const { api, roles, resources } = require("../../constants");
// const dispatcher = new events.EventEmitter();

// const randomString = () => [...Array(30)].map(() => Math.random().toString(36)[2]).join("");
// const getRandomInt = (max) => 1 + Math.round(Math.random() * Math.round(max - 1));
// const sendRandomMessage = () => {
//   setTimeout(() => {
//     const message = randomString();
//     dispatcher.emit("message", message);
//     // sendRandomMessage();
//   }, getRandomInt(5) * 1000);
// };

// /**
//  * @api {get} /v4/events
//  * @apiVersion 4.0
//  * @apiGroup Events
//  * @apiName get
//  * @apiSampleRequest /v4/events
//  */
// router.get(`/${api.v4}/events`, async (ctx) => {
//   const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
//   checkPerms(resources.events, user.role, "readAny");

//   const stream = new PassThrough();

//   const send = (data, event) => {
//     if (event) stream.write(`event: ${event}\n`);
//     stream.write(`data: ${JSON.stringify({ data })}\n\n`);
//   };
//   const finish = (e) => dispatcher.removeListener("message", send);

//   const closeConnection = (listener, err) => {
//     if (err) {
//       console.error(err);
//     }
//     console.debug(`SSE Client #${dispatcher.listenerCount("message")} disconnecting!`);
//     dispatcher.removeListener("message", listener);
//   };

//   const keepAlive = () => {
//     setTimeout(() => {
//       try {
//         stream.write("\n");
//         keepAlive(stream);
//       } catch (e) {
//         closeConnection(send, e);
//       }
//     }, 30 * 1000);
//   };

//   ctx.response.status = 200;
//   ctx.response.type = "text/event-stream; charset=utf-8";
//   ctx.response.set({
//     "Content-Type": "text/event-stream; charset=utf-8",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     // "Transfer-Encoding": "chunked",
//     // enabling CORS if needed
//     // "Access-Control-Allow-Origin": "*",
//     // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
//   });

//   ctx.response.body = stream;

//   stream.write(": open stream\n\n");
//   dispatcher.on("message", send);
//   ctx.req.on("close", finish);
//   ctx.req.on("finish", finish);
//   ctx.req.on("error", finish);

//   // keepAlive(stream, send);
//   sendRandomMessage();

//   const stream = new PassThrough();

//   ctx.set({
//     "Content-Type": "text/event-stream; charset=utf-8",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     "Transfer-Encoding": "chunked",
//     // enabling CORS if needed
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
//   });
//   let counter = 10;
//   const t = setInterval(() => {
//     stream.write(sse("counter", `${counter}`));
//     stream.write("\n\n");
//     counter--;
//     if (counter === 0) {
//       stream.end();
//       clearInterval(t);
//     }
//   }, 2000);

//   ctx.status = 200;
//   ctx.body = stream;
// });

module.exports = router;
