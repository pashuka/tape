const stream = require("stream");
const Transform = stream.Transform;
// const events = require("events");
// const dispatcher = new events.EventEmitter();

class SSETransform extends Transform {
  constructor(ctx, opts) {
    super({
      writableObjectMode: true,
    });
    this.opts = { ...SSETransform.defOpts, opts };
    this.ctx = ctx;
    this.ended = false;
    ctx.req.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);
    ctx.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // 'Keep-Alive': 'timeout=120',
      "X-Accel-Buffering": "no",
    });
    this.send(":ok");
    // dispatcher.on("message", this.send);
  }
  /**
   *
   * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
   * @param {Object} data sse send object mode
   * @param {Object|String} data.data data to send, if it's object, it will be converted to json
   * @param {String} data.event sse event name
   * @param {Number} data.id sse event id
   * @param {Number} data.retry sse retry times
   * @param {*} encoding not use
   * @param {function} callback same as the write method callback
   */
  send(data, encoding, callback) {
    // console.log("messae from ---->", data);
    if (arguments.length === 0 || this.ended) return false;
    Transform.prototype.write.call(this, data, encodeURI, callback);
  }

  /**
   *
   * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
   * @param {Object} data sse send object mode
   * @param {Object|String} data.data data to send, if it's object, it will be converted to json
   * @param {String} data.event sse event name
   * @param {Number} data.id sse event id
   * @param {Number} data.retry sse retry times
   * @param {*} encoding not use
   * @param {function} callback same as the write method callback
   */
  sendEnd(data, encoding, callback) {
    // if not set end(data), send end event before end, the event name is configurable
    // Because you override the native end method, In order to prevent multiple sending end events, add the ended prop
    if (this.ended) {
      return false;
    }
    if (!data && !this.ended) {
      data = { event: this.opts.closeEvent };
    }
    this.ended = true;
    Transform.prototype.end.call(this, data, encodeURI, callback);
  }

  end() {
    if (!this.ended) {
      this.ended = true;
    }
  }
  _transform(data, encoding, callback) {
    let senderObject,
      dataLines,
      prefix = "data: ",
      commentReg = /^\s*:\s*/;
    let res = [];
    if (typeof data === "string") {
      senderObject = { data: data };
    } else {
      senderObject = data;
    }
    if (senderObject.event) res.push("event: " + senderObject.event);
    if (senderObject.retry) res.push("retry: " + senderObject.retry);
    if (senderObject.id) res.push("id: " + senderObject.id);

    if (typeof senderObject.data === "object") {
      dataLines = JSON.stringify(senderObject.data);
      res.push(prefix + dataLines);
    } else if (typeof senderObject.data === "undefined") {
      // Send an empty string even without data
      res.push(prefix);
    } else {
      senderObject.data = String(senderObject.data);
      if (senderObject.data.search(commentReg) !== -1) {
        senderObject.data = senderObject.data.replace(commentReg, "");
        prefix = ": ";
      }
      senderObject.data = senderObject.data.replace(/(\r\n|\r|\n)/g, "\n");
      dataLines = senderObject.data.split(/\n/);

      for (var i = 0, l = dataLines.length; i < l; ++i) {
        var line = dataLines[i];
        if (i + 1 === l) res.push(prefix + line);
        else res.push(prefix + line);
      }
    }
    // Concentrated to send
    res = res.join("\n") + "\n\n";
    this.push(res);
    this.emit("message", res);
    // Compatible with koa-compress
    if (
      this.ctx.body &&
      typeof this.ctx.body.flush === "function" &&
      this.ctx.body.flush.name !== "deprecated"
    ) {
      this.ctx.body.flush();
    }
    callback();
  }
}

SSETransform.defOpts = {
  closeEvent: "close",
};

const DEFAULT_OPTS = {
  maxClients: 10000,
  pingInterval: 60000,
  closeEvent: "close",
};

/**
 * koa sse middleware
 * @param {Object} opts
 * @param {Number} opts.maxClients max client number, default is 10000
 * @param {Number} opts.pingInterval heartbeat sending interval time(ms), default 60s
 * @param {String} opts.closeEvent if not provide end([data]), send default close event to client, default event name is "close"
 * @param {String} opts.matchQuery when set matchQuery, only has query (whatever the value) , sse will create
 */
module.exports = function sse(opts = {}) {
  opts = Object.assign({}, DEFAULT_OPTS, opts);
  const pool = [];

  // let interval = setInterval(() => {
  //   let ts = +new Date();
  //   if (pool.length > 0) {
  //     pool.forEach((s) => s.send(":"));
  //     // console.log("SSE run ping: for " + pool.length + " clients");
  //   }
  // }, opts.pingInterval);

  return async function (ctx, next) {
    if (ctx.res.headersSent) {
      if (!(ctx.sse instanceof SSETransform)) {
        console.error("SSE response header has been send, Unable to create the sse response");
      }
      return await next();
    }
    if (pool.length >= opts.maxClients) {
      console.error(
        "SSE sse client number more than the maximum, Unable to create the sse response"
      );
      return await next();
    }
    if (opts.matchQuery && typeof ctx.query[opts.matchQuery] === "undefined") {
      return await next();
    }

    let sse = new SSETransform(ctx, opts);

    pool.push(sse);
    sse.on("close", function () {
      // dispatcher.removeListener("message", sse.send);
      pool.splice(pool.indexOf(sse), 1);
    });

    ctx.sse = ctx.response.sse = sse;

    await next();

    // if (!ctx.sse) {
    //     pool.splice(pool.indexOf(sse), 1);
    //     sse.destroy();
    //     return;
    // }
    if (!ctx.body) {
      ctx.body = ctx.sse;
    } else if (ctx.body instanceof stream) {
      if (ctx.body.writable) {
        ctx.body = ctx.body.pipe(ctx.sse);
      }
    } else {
      if (!ctx.sse.ended) {
        ctx.sse.send(ctx.body);
      }
      ctx.body = sse;
    }
  };
};
