const ServiceError = require("../core/serviceError");
const kmo = require("../repository/kmo");
const { getChildLogger } = require("../core/logging");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("user-service");
  this.logger.debug(message, meta);
};

const search = async (str) => {
  debugLog("Searching for kmo");
  const e = await kmo.search(str);
  return { kmo: e };
};

module.exports = {
  search,
};
