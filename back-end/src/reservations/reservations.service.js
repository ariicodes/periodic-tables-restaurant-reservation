const knex = require('../db/connection');

/**
 * List query for reservation resources
 */
const list = date => {
	return knex('reservations')
		.select('*')
		.where({ reservation_date: date || '' })
		.orderBy('reservation_time');
};

module.exports = {
	list,
};