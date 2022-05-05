const Router = require("@koa/router");
const installAccount = require('./_account');
const installKmo = require('./_kmo')

module.exports = (app) => {
    const router = new Router({
      prefix: "/api",
    });
  installAccount(router);
  installKmo(router)
    app.use(router.routes()).use(router.allowedMethods());
  };
  