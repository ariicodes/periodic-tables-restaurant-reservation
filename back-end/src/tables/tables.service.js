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
const update = async (table_id, reservation_id) => {
	return await knex('tables')
		.where({ table_id })
		.update({ reservation_id }, '*')
		.then(updatedRecords => updatedRecords[0]);
};

/**
 * Delete a reservation_id from a table
 */
const destroy = async table_id => {
	return await knex('tables')
		.where({ table_id })
		.update({ reservation_id: null }, '*')
		.then(updatedRecords => updatedRecords[0]);
};

module.exports = {
	list,
	create,
	read,
	update,
	destroy,
};
