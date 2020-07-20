const path = require("path");
const config = require("../.env").nodemailer;
const nodeMailer = require("nodemailer");
const Email = require("email-templates");
const transport = nodeMailer.createTransport(config.transport);

module.exports = new Email({
  views: {
    root: path.join(process.cwd(), "templates", "email")
  },
  message: {
    from: config.options.from
  },
  // preview: config.preview,
  // uncomment below to send emails in development/test env:
  send: ["test"].includes(process.env.NODE_ENV) ? false : config.send,
  transport
});
