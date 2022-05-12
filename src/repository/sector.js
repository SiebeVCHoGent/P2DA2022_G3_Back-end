const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const getById = async (id) => {
  return await getKnex()(tables.sector).select().where("id", id);
};

const getAll = async ()=>{
  return await getKnex()(tables.sector).select()
}

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

const bestSector = async ()=>{
  return await getKnex().raw('SELECT sectorId, s.naam, AVG(Score) FROM kmo k JOIN Coding_Tree c ON c.ondernemingsnummer = k.ondernemingsnummer JOIN sector s ON s.id = k.sectorid GROUP BY sectorid ORDER BY AVG(Score) DESC')
}

module.exports = {
  getById,
  bestOfSector,
  getAll,
  bestSector
};
