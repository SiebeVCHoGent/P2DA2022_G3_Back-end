const ServiceError = require("../core/serviceError");
const kmo = require("../repository/kmo");
const sector = require("../service/sector");
const { getChildLogger } = require("../core/logging");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("user-service");
  this.logger.debug(message, meta);
};

const search = async (str) => {
  debugLog("Searching for kmo");
  const e = await kmo.search(str);
  for (let i=0; i<e.length; i++) {
    if (e[i].parent !== null){
      e[i].hoofdsector = await sector.addHoofdsector(e[i].parent)
  }}
  return { kmo: e };
};


module.exports = {
  search,
};
