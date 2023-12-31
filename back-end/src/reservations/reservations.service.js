const knex = require('../db/connection');

/**
 * List reservations by date
 */
const list = date => {
	let dateQuery = date || '';
	return knex('reservations')
		.select('*')
		.where({ reservation_date: dateQuery })
		.whereNot({ status: 'finished' })
		.orderBy('reservation_time');
};

/**
 * Create a new reservation
 */
const create = async reservation => {
	return await knex('reservations')
		.insert(reservation)
		.returning('*')
		.then(createdRecords => createdRecords[0]);
};

/**
 * Read a reservation
 */
const read = async reservation_id => {
	return await knex('reservations')
		.select('*')
		.where({ reservation_id })
		.first();
};

/**
 * Update a reservation status
 */
const update = async (reservation_id, status) => {
	return await knex('reservations')
		.where({ reservation_id })
		.update({ status }, '*')
		.then(updatedRecords => updatedRecords[0]);
};

module.exports = {
	list,
	create,
	read,
	update,
};
