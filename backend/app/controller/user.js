"use strict";

const defaultAvatar =
  "//s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png";

const Controller = require("egg").Controller;

class UserController extends Controller {
  async register() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: "Username or password should not be empty!",
        data: null,
      };
      return;
    }

    // 验证数据库内是否已经有该账户名
    const userInfo = await ctx.service.user.getUserByName(username);

    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "The username has been taken, please try another!",
        data: null,
      };
      return;
    }

    const result = await ctx.service.user.register({
      username,
      password,
      signature: "Independence of spirit, Freedom of thought.",
      avatar: defaultAvatar,
      ctime: Date.now(),
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: "Register successfully",
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "Register failed!",
        data: null,
      };
    }
  }

  async login() {
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username);
    // 没找到说明没有该用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "Username does not exist!",
        data: null,
      };
      return;
    }

    if (userInfo && password != userInfo.password) {
      ctx.body = {
        code: 500,
        msg: "Wrong username or password!",
        data: null,
      };
      return;
    }

    // 生成 token 加盐
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为 24 小时
      },
      app.config.jwt.secret
    );

    ctx.body = {
      code: 200,
      message: "Log in successfully",
      data: {
        token,
      },
    };
  }

  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: "Request successfully",
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || "",
        avatar: userInfo.avatar || defaultAvatar,
      },
    };
  }

  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = "", avatar = "" } = ctx.request.body;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;

      const userInfo = await ctx.service.user.getUserByName(decode.username);
      const result = await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });

      ctx.body = {
        code: 200,
        msg: "Request successfully",
        data: {
          id: user_id,
          signature,
          username: userInfo.username,
          avatar,
        },
      };
    } catch (error) {}
  }

  async modifyPass() {
    const { ctx, app } = this;
    const { old_pass = "", new_pass = "", new_pass2 = "" } = ctx.request.body;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      if (decode.username == "admin") {
        ctx.body = {
          code: 400,
          msg: "Password reset is not allowed for admin account!x",
          data: null,
        };
        return;
      }
      user_id = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);

      if (old_pass != userInfo.password) {
        ctx.body = {
          code: 400,
          msg: "Wrong original password!",
          data: null,
        };
        return;
      }

      if (new_pass != new_pass2) {
        ctx.body = {
          code: 400,
          msg: "Passwords do not match!",
          data: null,
        };
        return;
      }

      const result = await ctx.service.user.modifyPass({
        ...userInfo,
        password: new_pass,
      });

      ctx.body = {
        code: 200,
        msg: "Request successfully",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "System error!",
        data: null,
      };
    }
  }

  async verify() {
    const { ctx, app } = this;
    const { token } = ctx.request.body;
    console.log(ctx.state.user);
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    console.log("decode", decode);
    ctx.body = "success gays";
  }
}

module.exports = UserController;
