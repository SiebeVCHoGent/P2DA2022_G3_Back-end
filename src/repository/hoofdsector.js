const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.hoofdsector).select().where("id", id);
};

const getAll = async () => {
  return await getKnex()(tables.hoofdsector).select();
};

const bestOfSector = async (id, limit = 20) => {
  return await getKnex()(tables.sector)
    .join(tables.kmo, `${tables.sector}.id`, "=", `${tables.kmo}.sectorid`)
    .leftJoin(
      tables.coding_tree,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.coding_tree}.ondernemingsnummer`
    )
    .join(
      tables.hoofdsector,
      `${tables.sector}.hoofdsectorId`,
      "=",
      `${tables.hoofdsector}.id`
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
      { hoofdsector: `${tables.hoofdsector}.naam` },
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
    .where("hoofdsectorId", id)
    .orderBy("Score", "desc")
    .limit(limit);
};

const bestSector = async () => {
  return await getKnex()(tables.kmo)
    .join(tables.sector, `${tables.sector}.id`, "=", `${tables.kmo}.sectorid`)
    .leftJoin(
      tables.coding_tree,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.coding_tree}.ondernemingsnummer`
    )
    .join(
      tables.hoofdsector,
      `${tables.sector}.hoofdsectorId`,
      "=",
      `${tables.hoofdsector}.id`
    )
    .select(`${tables.hoofdsector}.*`, getKnex().raw(`AVG(Score) as average`))
    .groupBy("hoofdsectorId")
    .orderBy(getKnex().raw("AVG(Score)"), "desc");
};

module.exports = {
  getById,
  bestOfSector,
  getAll,
  bestSector,
};
