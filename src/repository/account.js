const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const getById = async (a) => {
  return await getKnex()(tables.account).select().where('id', a);
};

const getByMail = async ( mail ) => {
  return await getKnex()(tables.account).select().where('email',mail);
};

const create = async (
  id,
  { voornaam, achternaam, email, wachtwoordHash, roles },
) => {
  try {
    await getKnex()(tables.account).insert({
      id: id,
      voornaam: voornaam,
      achternaam: achternaam,
      email: email,
      password: wachtwoordHash,
      roles: roles,
    });
    return await getById(id);
  } catch (error) {
    const logger = getChildLogger('account-repo');
    logger.error('Error in create', {
      error,
    });
  }
};

module.exports = {
  getById,
  getByMail,
  create,
};
