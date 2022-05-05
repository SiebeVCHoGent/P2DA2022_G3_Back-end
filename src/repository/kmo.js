const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const search = async (str)=>{
    return await getKnex().raw("SELECT kmo.*,gemeente.naam as gemeente, sector.naam as sector FROM kmo join sector on kmo.sectorid = sector.id join gemeente on gemeente.postcode = kmo.postcode WHERE ondernemingsnummer LIKE ? or kmo.naam LIKE ? limit 25;",[`%${str.replace(/\s/g, "")}`, `%${str}%`])
}

module.exports = {
    search
}