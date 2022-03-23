const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const getAll = async () => {
  return await getKnex()(tables.account).select().orderBy('achternaam', 'desc');
};

const getById = async (a) => {
  return await getKnex()(tables.account).select().where('id', a);
};

const getByMail = async ( mail ) => {
  return await getKnex()(tables.account).select().where('mail',mail);
};
const create = async (
  a,
  { mail, wachtwoordHash, naam, geboortedatum, groep, roles },
) => {
  try {
    await getKnex()(tables.account).insert({
      id: a,
      mail: mail,
      wachtwoord: wachtwoordHash,
      naam: naam,
      geboortedatum: geboortedatum,
      groep: groep,
      roles: roles,
    });
    return await getById(a);
  } catch (error) {
    const logger = getChildLogger('account-repo');
    logger.error('Error in create', {
      error,
    });
  }
};
const updateById = async (a, { wachtwoord, naam, geboortedatum, groep }) => {
  try {
    const e = await getKnex()(tables.account)
      .update({
        wachtwoord: wachtwoord,
        naam: naam,
        geboortedatum: geboortedatum,
        groep: groep,
      })
      .where({ id: a });
    return e>0;
  } catch (error) {
    const logger = getChildLogger('account-repo');
    logger.error('Error in updateById', {
      error,
    });
  }
};
const deleteById = async (a) => {
  try {
    const rows = await getKnex()(tables.account).delete().where({ id: a });
    return rows > 0;
  } catch (error) {
    const logger = getChildLogger('account-repo');
    logger.error('Error in deleteById', {
      error,
    });
  }
};
module.exports = {
  getAll,
  getById,
  getByMail,
  create,
  updateById,
  deleteById,
};
