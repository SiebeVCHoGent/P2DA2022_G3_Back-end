const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
const account = require('../repository/account');
const { hashPassword, verifyPassword } = require('../core/password');
const Roles = require('../core/roles');
const { generateJWT, verifyJWT } = require('../core/jwt');
const ServiceError = require('../core/serviceError');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('user-service');
  this.logger.debug(message, meta);
};

const makeExposedUser = ({ wachtwoord, ...user }) => user;
const loginData = async (user) => {
  const token = await generateJWT(user);
  return {
    token,
    user: makeExposedUser(user),
  };
};

const checkSession = async (header) => {
  if (!header) {
    throw ServiceError.unauthorized('Not signed in yet');
  }
  if (!header.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }
  const authToken = header.substr(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);
    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('speler-service');
    logger.error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);
  if (!hasPermission) {
    throw ServiceError.unauthorized('Not allowed');
  }
};

const login = async ({ email, ww }) => {
  const sp = await account.getByMail(email);
  if (!sp || sp.length === 0) {
    throw ServiceError.unauthorized('Given mail and password do not match');
  }
  const user = sp[0];
  const passwordValid = await verifyPassword(ww, user.wachtwoord);
  if (!passwordValid) {
    throw ServiceError.unauthorized('Given mail and password do not match');
  }
  return loginData(user);
};

const create = async ({ voornaam, achternaam, email, ww}) => {
  const id = uuid.v4();
  const wachtwoordHash = await hashPassword(ww);
  debugLog(`registering new account ${id}`, { email });
  const test = await account.getByMail(email);
  if (test.length > 0) throw ServiceError.forbidden('Duplicate mail');
  
  const user = await account.create(id, {
    voornaam,
    achternaam,
    email,
    wachtwoordHash,
    roles: JSON.stringify([Roles.STANDAARD]),
  });
  
  return loginData(user[0]);
};


module.exports = {
  login,
  create,
  checkSession,
  checkRole,
};
