const reservationsService = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * Middleware to validate the existence of reservations for a specific date
 */
const reservationsExists = async (req, res, next) => {
	const { date } = req.query;
	let reservations = await reservationsService.list(date);
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
 * Middleware to check for required fields
 */
const checkRequiredFields = (req, res, next) => {
	const {
		first_name,
		last_name,
		mobile_number,
		reservation_date,
		reservation_time,
		people,
	} = req.body.data || {};

	const requiredFields = {
		first_name: 'A first_name property is required.',
		last_name: 'A last_name property is required.',
		mobile_number: 'A mobile_number property is required.',
		reservation_date: 'A reservation_date property is required.',
		reservation_time: 'A reservation_time property is required.',
		people: 'A people property is required.',
	};

	for (const field in requiredFields) {
		if (!req.body.data.hasOwnProperty(field) || req.body.data[field] === '') {
			return next({
				status: 400,
				message: requiredFields[field],
			});
		}
	}
	return next();
};

/**
 * Middleware to check for valid types
 */
const checkTypes = (req, res, next) => {
	const {
		first_name,
		last_name,
		mobile_number,
		reservation_date,
		reservation_time,
		people,
	} = req.body.data || {};

	const typeChecks = {
		first_name: 'string',
		last_name: 'string',
		mobile_number: 'string',
		reservation_date: 'string',
		reservation_time: 'string',
		people: 'number',
	};

	for (const field in typeChecks) {
		if (typeof req.body.data[field] !== typeChecks[field]) {
			return next({
				status: 400,
				message: `A ${field} property must be a ${typeChecks[field]}.`,
			});
		}
	}
	return next();
};

/**
 * Middleware to check for valid date
 */
const checkDateValidity = (req, res, next) => {
	const { reservation_date } = req.body.data || {};

	if (reservation_date.length !== 10) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes('-') === false) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes('T') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes(':') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes('Z') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes(' ') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes('M') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes('A') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	if (reservation_date.includes('P') === true) {
		return next({
			status: 400,
			message: `A reservation_date property must be a valid date.`,
		});
	}
	return next();
};

/**
 * Middleware to check for valid time
 */
const checkTimeValidity = (req, res, next) => {
	const { reservation_time } = req.body.data || {};

	if (reservation_time.length !== 5) {
		return next({
			status: 400,
			message: `A reservation_time property must be a valid time.`,
		});
	}
	if (reservation_time < '10:30') {
		return next({
			status: 400,
			message: `A reservation_time property must be during business hours.`,
		});
	}
	if (reservation_time > '21:30') {
		return next({
			status: 400,
			message: `A reservation_time property must be during business hours.`,
		});
	}
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
		await reservationsService.create(newReservation);
		res.status(201).json({ data: newReservation });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	list: [asyncErrorBoundary(reservationsExists), asyncErrorBoundary(list)],
	create: [
		checkRequiredFields,
		checkTypes,
		checkDateValidity,
		checkTimeValidity,
		asyncErrorBoundary(create),
	],
};
