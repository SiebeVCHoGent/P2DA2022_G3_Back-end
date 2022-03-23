const Router = require("@koa/router");
const account = require("../service/account");
const { requireAuth, makeRequiredRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getAll = async (ctx) => {
  ctx.body = await account.getAll();
};

const getById = async (ctx) => {
  ctx.body = await account.getById(ctx.params.id);
};
getById.validateScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const login = async (ctx) => {
  ctx.body = await account.login(ctx.request.body);
};
login.validateScheme = {
  body: {
    mail: Joi.string(),
    wachtwoord: Joi.string(),
  },
};

const register = async (ctx) => {
  ctx.body = await account.create(ctx.request.body);
};
register.validateScheme = {
  body: {
    mail: Joi.string(),
    wachtwoord: Joi.string(),
    naam: Joi.string(),
    geboortedatum: Joi.date().less("now"),
    groep: Joi.string(),
  },
};

const updateById = async (ctx) => {
  ctx.body = await account.updateById(ctx.params.id, ctx.request.body);
};
updateById.validateScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    wachtwoord: Joi.string(),
    naam: Joi.string(),
    geboortedatum: Joi.date().less("now"),
    groep: Joi.string(),
  },
};

const deleteById = async (ctx) => {
  await account.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteById.validateScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/account",
  });
  const requireAdmin = makeRequiredRole(Role.ADMIN);
  //const requireTrainer = makeRequiredRole(Role.TRAINER);
  router.get("/", requireAuth, requireAdmin, getAll);
  router.get("/:id", requireAuth, validate(getById.validateScheme), getById);
  router.post("/login", validate(login.validateScheme), login);
  router.post("/", validate(register.validateScheme), register);
  router.put(
    "/:id",
    requireAuth,
    validate(updateById.validateScheme),
    updateById
  );
  router.delete(
    "/:id",
    requireAuth,
    requireAdmin,
    validate(deleteById.validateScheme),
    deleteById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
