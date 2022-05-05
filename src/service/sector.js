const ServiceError = require("../core/serviceError");
const sector = require("../repository/sector");
const { getChildLogger } = require("../core/logging");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("user-service");
  this.logger.debug(message, meta);
};

const getById = async (id) => {
  debugLog("Fetching sector", { id });
  const e = await sector.getById(id)
  if (e[0].length === 0) return {sector: null}
  return {sector: e[0][0]}
};

module.exports = {
  getById,
};
