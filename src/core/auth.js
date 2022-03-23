const account = require('../service/account');

module.exports.requireAuth = async (ctx,next)=>{
  const {
    authorization,
  } = ctx.headers;
  const {
    authToken,...session
  } = await account.checkSession(authorization);
  ctx.state.session = session;
  ctx.state.authToken = authToken;
  return next();

};
module.exports.makeRequiredRole = (role)=> async (ctx,next)=>{
  const {
    roles=[],
  } = ctx.state.session;
  speler.checkRole(role,roles);
  return next();
};
