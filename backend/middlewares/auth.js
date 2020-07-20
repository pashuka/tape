const { Unauthorized } = require('../libraries/error');

module.exports = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await next();
    } else {
        throw new Unauthorized('Missing Auth');
    }
};
