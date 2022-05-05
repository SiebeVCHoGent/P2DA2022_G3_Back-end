const Router = require("@koa/router");
const kmo = require("../service/kmo");
const { requireAuth, makeRequiredRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const search = async (ctx)=>{
    ctx.body = await kmo.search(ctx.params.id)
}
search.validateScheme = {
    params: {
        id: Joi.string()
    }
}

module.exports = (app)=>{
    const router = new Router({
        prefix: "/kmo",
      });

      router.get('/:id',validate(search.validateScheme),search)

    app.use(router.routes()).use(router.allowedMethods());
}