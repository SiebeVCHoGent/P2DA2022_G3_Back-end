const Router = require("@koa/router");
const sector = require("../service/sector");
const { requireAuth, makeRequiredRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getById = async (ctx) => {
  ctx.body = await sector.getById(ctx.params.id);
};
getById.validateScheme = {
  params: {
    id: Joi.number(),
  },
};

const getBest = async (ctx) => {
  ctx.body = await sector.getBest(ctx.params.id);
};
getBest.validateScheme = {
  params: {
    id: Joi.number(),
  },
};

const getAll = async (ctx) => {
  ctx.body = await sector.getAll();
};
const bestSector = async (ctx) => {
  ctx.body = await sector.bestSector();
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/sector",
  });

  router.get("/", requireAuth, getAll);
  router.get("/best", requireAuth, bestSector);
  router.get(
    "/best/:id",
    requireAuth,
    validate(getBest.validateScheme),
    getBest
  );
  router.get("/:id", requireAuth, validate(getById.validateScheme), getById);

  app.use(router.routes()).use(router.allowedMethods());
};
