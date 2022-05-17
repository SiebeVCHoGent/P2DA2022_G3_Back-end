const ServiceError = require("../core/serviceError");
const hoofdsector = require("../repository/hoofdsector");
const { getChildLogger } = require("../core/logging");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("user-service");
  this.logger.debug(message, meta);
};

const getById = async (id) => {
  debugLog("Fetching sector", { id });
  const sectors = await hoofdsector.getById(id);
  if (sectors.length === 0) return { hoofdsector: null };
  return { hoofdsector: sectors[0] };
};
const getAll = async ()=>{
  debugLog('Fetching all sectors')
  const sectors = await hoofdsector.getAll()
  return {hoofdsector: sectors}
}

const getBest = async (id,limit) => {
  debugLog("Fetching best of sector");
  const sectors = await hoofdsector.bestOfSector(id,limit);
  if (hoofdsector.length === 0) return { kmos: null };
  return { kmos: sectors };
};
const bestSector = async ()=>{
  debugLog('Getting best average')
  const sectors = await hoofdsector.bestSector()
  return {hoofdsector: sectors}
}

module.exports = {
  getById,
  getBest,
  getAll,
  bestSector
};
