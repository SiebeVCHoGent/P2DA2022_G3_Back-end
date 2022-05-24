const Router = require("@koa/router");
const hoofdsector = require("../service/hoofdsector");
const { requireAuth, makeRequiredRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getById = async (ctx) => {
  ctx.body = await hoofdsector.getById(ctx.params.id);
};
getById.validateScheme = {
  params: {
    id: Joi.number(),
  },
};

const getBest = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  ctx.body = await hoofdsector.getBest(ctx.params.id, limit);
};
getBest.validateScheme = {
  params: {
    id: Joi.number(),
  },
  query: Joi.object({
    limit: Joi.number().positive().integer().optional(),
  }).and("limit"),
};

const getAll = async (ctx) => {
  ctx.body = await hoofdsector.getAll();
};
const bestSector = async (ctx) => {
  ctx.body = await hoofdsector.bestSector();
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/hoofdsector",
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
