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
 * Delete a reservation_id from a table and update the reservation status to finished using knex transaction
 */
const destroy = async table_id => {
	return await knex.transaction(async trx => {
		const table = await knex('tables')
			.select('*')
			.where({ table_id })
			.first()
			.transacting(trx);
		await knex('tables')
			.where({ table_id })
			.update({ reservation_id: null }, '*')
			.transacting(trx);
		await knex('reservations')
			.where({ reservation_id: table.reservation_id })
			.update({ status: 'finished' }, '*')
			.transacting(trx);
	});
};

module.exports = {
	list,
	create,
	read,
	update,
	destroy,
};
