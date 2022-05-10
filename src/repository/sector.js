const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.sector).select().where("id", id);
};

const bestOfSector = async (id) => {
  return await getKnex()(tables.sector)
    .join(tables.kmo, `${tables.sector}.id`, "=", `${tables.kmo}.sectorid`)
    .leftJoin(
      tables.coding_tree,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.coding_tree}.ondernemingsnummer`
    )
    .join(
      tables.gemeente,
      `${tables.kmo}.postcode`,
      "=",
      `${tables.gemeente}.postcode`
    )
    .leftJoin(
      tables.jaarverslagen,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.jaarverslagen}.ondernemingsnummer`
    )
    .select(
      `${tables.kmo}.*`,
      { sector: `${tables.sector}.naam` },
      { gemeente: `${tables.gemeente}.naam` },
      "Tree",
      "Score",
      "Percentiel",
      "omzetcijfer",
      "balanstotaal",
      "link",
      "boekjaar"
    )
    .where("id", id)
    .orderBy("Score", "desc")
    .limit(10);
};

module.exports = {
  getById,
  bestOfSector,
};
