const ServiceError = require("../core/serviceError");
const hoofdsector = require("../repository/hoofdsector");
const { getChildLogger } = require("../core/logging");
const sector = require("../service/sector");

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
  const e = await hoofdsector.bestOfSector(id,limit);
  if (e.length === 0) return { kmos: null };
  for (let i=0; i<e.length; i++) {
    if (e[i].parent !== null){
      e[i].hoofdsector = await sector.addHoofdsector(e[i].parent)
  }}
  return { kmos: e };
};
const bestSector = async ()=>{
  debugLog('Getting best average')
  const e = await hoofdsector.bestSector()
  for (let i=0; i<e.length; i++) {
    if (e[i].parent !== null){
      e[i].hoofdsector = await sector.addHoofdsector(e[i].parent)
  }}
  return {hoofdsector: e}
}

module.exports = {
  getById,
  getBest,
  getAll,
  bestSector
};
