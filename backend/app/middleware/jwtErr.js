"use strict";

module.exports = (options) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization; // if token is null，return null
    let decode;
    if (token != "null" && token) {
      try {
        decode = ctx.app.jwt.verify(token, options.secret); // verify token
        await next();
      } catch (error) {
        console.log("error", error);
        ctx.status = 200;
        ctx.body = {
          msg: "token has expired, please log in again",
          code: 401,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: "token does not exist",
      };
      return;
    }
  };
};
