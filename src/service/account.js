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

const getAll = async () => {
  debugLog('Fetching all accounts');
  return await account.getAll();
};
const getById = async (a) => {
  debugLog('Getting account', { a });
  const e = await account.getById(a);
 
  if (!e[0]) {
    throw ServiceError.notFound(`User ${a} was not found`);
  }
  return makeExposedUser(e[0]);
};

const login = async ({ mail, wachtwoord }) => {
  const sp = await account.getByMail(mail);
  if (!sp || sp.length === 0) {
    throw ServiceError.unauthorized('Given mail and password do not match');
  }
  const user = sp[0];
  const passwordValid = await verifyPassword(wachtwoord, user.wachtwoord);
  if (!passwordValid) {
    throw ServiceError.unauthorized('Given mail and password do not match');
  }
  return loginData(user);
};
const create = async ({ mail, wachtwoord, naam, geboortedatum, groep }) => {
  const id = uuid.v4();
  const wachtwoordHash = await hashPassword(wachtwoord);
  debugLog(`registering new account ${id}`, { mail });
  const test = await account.getByMail(mail);
  if (test.length > 0) throw ServiceError.forbidden('Duplicate mail');
  const user = await account.create(id, {
    mail,
    wachtwoordHash,
    naam,
    geboortedatum,
    groep,
    roles: JSON.stringify([Roles.SPELER]),
  });
  return await loginData(user);
};
const updateById = async (a, { wachtwoord, naam, geboortedatum, groep }) => {
  debugLog('Updating user', { a });
  wachtwoord = await hashPassword(wachtwoord);
  const e = await account.updateById(a, { wachtwoord, naam, geboortedatum, groep });
  if (!e) throw ServiceError.notFound(`user ${a} not found`, { a });
  return getById(a);
};
const deleteById = async (a) => {
  debugLog('Deleting speler', { a });
  const del = await account.deleteById(a);
  if (!del) throw ServiceError.notFound('Account does not exist');
};
module.exports = {
  getAll,
  getById,
  login,
  create,
  updateById,
  deleteById,
  checkSession,
  checkRole,
};
