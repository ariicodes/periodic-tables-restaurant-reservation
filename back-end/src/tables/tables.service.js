const knex = require('../db/connection');

/**
 * List tables
 */
const list = () => {
	return knex('tables').select('*').orderBy('table_name');
};

/**
 * Create a new table
 */
const create = async table => {
	return await knex('tables')
		.insert(table)
		.returning('*')
		.then(createdRecords => createdRecords[0]);
};

/**
 * Read a table
 */
const read = async table_id => {
	return await knex('tables').select('*').where({ table_id }).first();
};

/**
 * Update a table
 */
const update = async assignedTable => {
	return await knex('tables')
		.where({ table_id: assignedTable.table_id })
		.update(assignedTable, '*')
		.then(updatedRecords => updatedRecords[0]);
};

module.exports = {
	list,
	create,
	read,
	update,
};
