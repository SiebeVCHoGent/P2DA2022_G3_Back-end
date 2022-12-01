const ServiceError = require("../core/serviceError");
const sector = require("../repository/sector");
const { getChildLogger } = require("../core/logging");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("user-service");
  this.logger.debug(message, meta);
};

const addHoofdsector = async (r)=>{
  const e=  await sector.getById(r)
  return e[0]?.naam
}

const getById = async (id) => {
  debugLog("Fetching sector", { id });
  const sectors = await sector.getById(id);
  if (sectors.length === 0) return { sector: null };
  return { sector: sectors[0] };
};
const getAll = async ()=>{
  debugLog('Fetching all sectors')
  const sectors = await sector.getAll()
  return {sector: sectors}
}

const getBest = async (id) => {
  debugLog("Fetching best of sector");
  const e = await sector.bestOfSector(id);
  if (sector.length === 0) return { kmos: null };
  for (let i=0; i<e.length; i++) {
    if (e[i].parent !== null){
      e[i].hoofdsector = await addHoofdsector(e[i].parent)
  }}
  return { kmos: e };
};
const bestSector = async ()=>{
  debugLog('Getting best average')
  const e = await sector.bestSector()
  for (let i=0; i<e.length; i++) {
    if (e[i].parent !== null){
      e[i].hoofdsector = await addHoofdsector(e[i].parent)
  }}
  return {sector: e}
}

module.exports = {
  getById,
  getBest,
  getAll,
  bestSector,
  addHoofdsector
};
