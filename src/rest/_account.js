const Router = require("@koa/router");
const account = require("../service/account");
const { requireAuth, makeRequiredRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const login = async (ctx) => {
  ctx.body = await account.login(ctx.request.body);
};

login.validateScheme = {
  body: {
    email: Joi.string(),
    ww: Joi.string(),
  },
};

const register = async (ctx) => {
  ctx.body = await account.create(ctx.request.body);
};

register.validateScheme = {
  body: {
    voornaam: Joi.string(),
    achternaam: Joi.string(),
    email: Joi.string(),
    ww: Joi.string(),
  },
};


module.exports = (app) => {
  const router = new Router({
    prefix: "/account",
  });
  const requireAdmin = makeRequiredRole(Role.ADMIN);
  //const requireTrainer = makeRequiredRole(Role.TRAINER);

  router.post("/login", validate(login.validateScheme), login);
  router.post("/register", validate(register.validateScheme), register);

  app.use(router.routes()).use(router.allowedMethods());
};
