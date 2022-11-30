const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const search = async (str) => {
  return await getKnex()(tables.kmo)
    .join(tables.sector, `${tables.kmo}.sector`, "=", `${tables.sector}.code`)
    .leftJoin(
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
    //.leftJoin(tables.hoofdsector,`${tables.sector}.hoofdsectorId`,'=',`${tables.hoofdsector}.id`)
    .select(
      "kmo.*",
      { sector: `${tables.sector}.naam` },
      "code","parent",
      //{hoofdsector: `${tables.hoofdsector}.naam`},
      { gemeente: `${tables.gemeente}.naam` },
      //"hoofdsectorId",
      "jaar","aantalwerknemers","omzet","balanstotaal",
      
    )
    .whereILike(`${tables.kmo}.naam`, `%${str}%`)
    .orWhereILike(
      `${tables.kmo}.ondernemingsnummer`,
      `%${str.replace(/\s/g, "")}%`
    )
    .limit(25);
};

module.exports = {
  search,
};
