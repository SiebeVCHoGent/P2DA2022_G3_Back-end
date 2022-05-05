const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const getById = async (id)=>{
    return await getKnex().raw('select * from sector where id = ? ',[id])
}

module.exports = {
    getById
}