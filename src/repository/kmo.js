const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const search = async (str) => {
  return await getKnex()(tables.kmo)
    .join(tables.sector, `${tables.kmo}.sectorid`, "=", `${tables.sector}.id`)
    .leftJoin(
      tables.gemeente,
      `${tables.kmo}.postcode`,
      "=",
      `${tables.gemeente}.postcode`
    )
    .leftJoin(
      tables.coding_tree,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.coding_tree}.ondernemingsnummer`
    )
    .leftJoin(
      tables.jaarverslagen,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.jaarverslagen}.ondernemingsnummer`
    )
    .leftJoin(tables.hoofdsector,`${tables.sector}.hoofdsectorId`,'=',`${tables.hoofdsector}.id`)
    .select(
      "kmo.*",
      { sector: `${tables.sector}.naam` },
      {hoofdsector: `${tables.hoofdsector}.naam`},
      { gemeente: `${tables.gemeente}.naam` },
      "hoofdsectorId",
      "Tree",
      "Score",
      "Percentiel",
      "omzetcijfer",
      "balanstotaal",
      "link",
      "boekjaar"
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
