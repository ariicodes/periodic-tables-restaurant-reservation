const knex = require('../db/connection');

/**
 * List reservations by date
 */
const list = date => {
	let dateQuery = date || '';
	return knex('reservations')
		.select('*')
		.where({ reservation_date: dateQuery })
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

module.exports = {
	list,
	create,
};
