const reservationsService = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * Middleware to validate the existence of reservations for a specific date
 */
const reservationsExists = async (req, res, next) => {
	const { date } = req.query;
	let reservations = await service.list(date);
	if (reservations) {
		res.locals.reservations = reservations;
		return next();
	}
	return next({
		status: 404,
		message: `Reservations can not be found.`,
	});
};

/**
 * List handler for reservation resources
 */
const list = (req, res) => {
	const { reservations } = res.locals;
	return res.json({ data: reservations });
};

/**
 * Create handler for reservation resources
 */
const create = async (req, res) => {
	try {
		const {
			data: {
				first_name,
				last_name,
				mobile_number,
				reservation_date,
				reservation_time,
				people,
			} = {},
		} = req.body;
		const newReservation = {
			first_name,
			last_name,
			mobile_number,
			reservation_date,
			reservation_time,
			people,
		};
		await service.create(newReservation);
		res.status(201).json({ data: newReservation });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	list: [asyncErrorBoundary(reservationsExists), asyncErrorBoundary(list)],
	create: asyncErrorBoundary(create),
};
