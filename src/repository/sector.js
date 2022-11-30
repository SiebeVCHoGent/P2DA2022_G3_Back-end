const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.sector).select().where("code", id);
};

const getAll = async () => {
  return await getKnex()(tables.sector).select();
};

const bestOfSector = async (id) => {
  return await getKnex()(tables.sector)
    .join(tables.kmo, `${tables.sector}.code`, "=", `${tables.kmo}.sector`)
    .join(
      tables.gemeente,
      `${tables.kmo}.postcode`,
      "=",
      `${tables.gemeente}.postcode`
    )
    .leftJoin(tables.verslag, `${tables.kmo}.ondernemingsnummer`, "=", `${tables.verslag}.ondernemingsnummer`)
    .leftJoin(
      tables.jaarverslagen,
      `${tables.verslag}.id`,
      "=",
      `${tables.jaarverslagen}.verslag`
    )
    .leftJoin(tables.website, `${tables.verslag}.id`, "=", `${tables.website}.verslag`)
    //.join(tables.hoofdsector,`${tables.sector}.hoofdsectorId`,'=',`${tables.hoofdsector}.id`)
    .select(
      "kmo.*",
      { sector: `${tables.sector}.naam` },
      "code","parent",
      //{hoofdsector: `${tables.hoofdsector}.naam`},
      { gemeente: `${tables.gemeente}.naam` },
      //"hoofdsectorId",
      "jaar","aantalwerknemers","omzet","balanstotaal",
      { jaarverslagurl: `${tables.jaarverslagen}.url` },
      { websiteurl: `${tables.website}.url`}
    )
    .where("sector.code", id)
    //.orderBy("Score", "desc")
    .limit(10);
};

const bestSector = async () => {
  
  return await getKnex()(tables.kmo)
    .join(tables.sector, `${tables.sector}.code`, "=", `${tables.kmo}.sector`)
    //.leftJoin(tables.coding_tree, `${tables.kmo}.ondernemingsnummer`, "=", `${tables.coding_tree}.ondernemingsnummer`)
    //.join(tables.hoofdsector,`${tables.sector}.hoofdsectorId`,'=',`${tables.hoofdsector}.id`)
    .select('sector',`${tables.sector}.naam`,/*getKnex().raw(`AVG(Score) as average`)*/)
    .groupBy("sector")
    //.orderBy(getKnex().raw('AVG(Score)'),'desc')
};

module.exports = {
  getById,
  bestOfSector,
  getAll,
  bestSector,
};
