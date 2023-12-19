const knex = require('../db/connection');

/**
 * List query; lists all reservations for a given date.
 */
const list = date => {
	return knex('reservations')
		.select('*')
		.where({ reservation_date: date || '' })
		.orderBy('reservation_time');
};

/**
 * Create query; creates a new reservation.
 */
const create = async reservation => {
	return knex('reservations')
		.insert(reservation)
		.returning('*')
		.then(createdRecords => createdRecords[0]);
};

module.exports = {
	list,
  create,
};
