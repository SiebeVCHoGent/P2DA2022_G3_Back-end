const Router = require("@koa/router");
const sector = require("../service/sector");
const { requireAuth, makeRequiredRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getById = async (ctx)=>{
    ctx.body = await sector.getById(ctx.params.id)
}
getById.validateScheme = {
    params: {
        id: Joi.number()
    }
}

module.exports = (app)=>{
    const router = new Router({
        prefix: "/sector",
      });

      router.get('/:id',validate(getById.validateScheme),getById)

    app.use(router.routes()).use(router.allowedMethods());
}