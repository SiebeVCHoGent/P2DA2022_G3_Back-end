const Router = require("@koa/router");
const installAccount = require('./_account');


module.exports = (app) => {
    const router = new Router({
      prefix: "/api",
    });
  installAccount(router);
    app.use(router.routes()).use(router.allowedMethods());
  };
  