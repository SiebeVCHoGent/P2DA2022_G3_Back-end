const Router = require("@koa/router");
const installAccount = require('./_account');
const installKmo = require('./_kmo')
const installSector = require('./_sector')
//const installHoofdsector = require('./_hoofdsector')

module.exports = (app) => {
    const router = new Router({
      prefix: "/api",
    });
  installAccount(router);
  installKmo(router)
  installSector(router)
  //installHoofdsector(router)
    app.use(router.routes()).use(router.allowedMethods());
  };
  