const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.sector).select().where("code", id);
};

const getAll = async () => {
  return await getKnex()(tables.sector).select().whereNull("parent");
};

const bestOfSector = async (id, limit = 20) => {
  return await getKnex()(tables.sector)
    .join(tables.kmo, `${tables.sector}.code`, "=", `${tables.kmo}.sector`)
    /*.join(
      tables.hoofdsector,
      `${tables.sector}.hoofdsectorId`,
      "=",
      `${tables.hoofdsector}.id`
    )*/
    .join(
      tables.gemeente,
      `${tables.kmo}.postcode`,
      "=",
      `${tables.gemeente}.postcode`
    )
    .leftJoin(
      tables.verslag,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.verslag}.ondernemingsnummer`	
    )
    .leftJoin(
      tables.jaarverslagen,
      `${tables.verslag}.id`,
      "=",
      `${tables.jaarverslagen}.verslag`
    )
    .leftJoin(tables.website, `${tables.verslag}.id`, "=", `${tables.website}.verslag`)
    .leftJoin(tables.zoektermscores, `${tables.verslag}.id`, "=", `${tables.zoektermscores}.verslag_id`)
    .select(
      "kmo.*",
      { sector: `${tables.sector}.naam` },
      "code","parent",
      //{hoofdsector: `${tables.hoofdsector}.naam`},
      { gemeente: `${tables.gemeente}.naam` },
      //"hoofdsectorId",
      "jaar","aantalwerknemers","omzet","balanstotaal",
      { jaarverslagurl: `${tables.jaarverslagen}.url` },
      { websiteurl: `${tables.website}.url`},
      "website_score","jaarverslag_score","zoekterm_id"
    )
    .where("parent", id)
    //.orderBy("Score", "desc")
    .limit(limit);
};

const bestSector = async () => {
  return await getKnex()(tables.kmo)
    .join(tables.sector, `${tables.sector}.code`, "=", `${tables.kmo}.sector`)
    /*.join(
      tables.hoofdsector,
      `${tables.sector}.hoofdsectorId`,
      "=",
      `${tables.hoofdsector}.id`
    )*/
    .select()
    .limit(10)
    //.groupBy("code")
    //.orderBy(getKnex().raw("AVG(Score)"), "desc");
};

module.exports = {
  getById,
  bestOfSector,
  getAll,
  bestSector,
};
