const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.sector).select().where("id", id);
};

module.exports = {
  getById,
};
