const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.sector).select().where("id", id);
};

const getAll = async () => {
  return await getKnex()(tables.sector).select();
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
    .join(tables.hoofdsector,`${tables.sector}.hoofdsectorId`,'=',`${tables.hoofdsector}.id`)
    .select(
      `${tables.kmo}.*`,
      { sector: `${tables.sector}.naam` },
      { gemeente: `${tables.gemeente}.naam` },
      {hoofdsector : `${tables.hoofdsector}.naam`},
      "hoofdsectorId",
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

const bestSector = async () => {
  
  return await getKnex()(tables.kmo)
    .join(tables.sector, `${tables.sector}.id`, "=", `${tables.kmo}.sectorid`)
    .leftJoin(
      tables.coding_tree,
      `${tables.kmo}.ondernemingsnummer`,
      "=",
      `${tables.coding_tree}.ondernemingsnummer`
    )
    .join(tables.hoofdsector,`${tables.sector}.hoofdsectorId`,'=',`${tables.hoofdsector}.id`)
    .select('sectorId',`${tables.sector}.naam`,`${tables.hoofdsector}.naam`,"hoofdsectorId",getKnex().raw(`AVG(Score) as average`))
    .groupBy("sectorid")
    .orderBy(getKnex().raw('AVG(Score)'),'desc')
};

module.exports = {
  getById,
  bestOfSector,
  getAll,
  bestSector,
};
