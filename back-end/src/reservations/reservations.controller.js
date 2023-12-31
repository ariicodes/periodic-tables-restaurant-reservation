const reservationsService = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * Middleware to validate the existence of reservations for a specific date
 */
const reservationsExists = async (req, res, next) => {
	const { date, mobile_number } = req.query;
	let reservations = null;
	if (date) {
		reservations = await reservationsService.list(date);
		reservations = reservations.filter(
			reservation => reservation.status !== 'finished'
		);
	} else if (mobile_number) {
		reservations = await reservationsService.search(mobile_number);
	}

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
 * Middleware to validate the existence of a reservation by id
 */
const reservationExistsById = async (req, res, next) => {
	const { reservation_id } = req.params;
	const reservation = await reservationsService.read(reservation_id);
	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	return next({
		status: 404,
		message: `Reservation ${reservation_id} cannot be found.`,
	});
};

/**
 * Middleware to validate the existence of data
 */
const dataExists = async (req, res, next) => {
	const { data } = req.body;
	if (!data) {
		return next({
			status: 400,
			message: `data is missing.`,
		});
	}
	return next();
};

/**
 * Middleware to check for required fields
 */
const checkRequiredFields = (req, res, next) => {
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
		data: {
			first_name,
			last_name,
			mobile_number,
			reservation_date,
			reservation_time,
			people,
		} = {},
	} = req.body;

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
 * Middleware to check for valid date format
 */
const checkDateFormat = (req, res, next) => {
	const { data: { reservation_date } = {} } = req.body;
	// Use regex to confirm that the date is formatted properly
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(reservation_date)) {
		throw { status: 400, message: 'reservation_date is invalid' };
	}
	return next();
};

/**
 * Middleware to check if date falls on a Tuesday
 */
const checkTuesday = (req, res, next) => {
	const { data: { reservation_date } = {} } = req.body;
	// Split the date by '-' and convert the resulting substrings to numbers
	const [year, month, day] = reservation_date.split('-').map(Number);
	// Converts the date to the ISO 8601 format
	const convertedDate = new Date(year, month - 1, day);

	// Check if the date is a Tuesday; getDay() provides the day number where 2 = Tuesday via JavaScript months
	if (convertedDate.getDay() === 2) {
		throw {
			status: 400,
			message: 'Restaurant is closed on Tuesdays. Please choose another date.',
		};
	}
	return next();
};

/**
 * Middleware to check if date is in the past
 */
const checkPastDate = (req, res, next) => {
	const { data: { reservation_date } = {} } = req.body;
	// Split the date by '-' and convert the resulting substrings to numbers
	const [year, month, day] = reservation_date.split('-').map(Number);
	// Converts the date to the ISO 8601 format
	const convertedDate = new Date(year, month - 1, day);

	// Check if the date is in the past by comparing ISO formatted dates
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (convertedDate < today) {
		throw { status: 400, message: 'Please choose a future date.' };
	}
	return next();
};

/**
 * Middleware to time is outside of business hours (10:30am - 10:30pm)
 */
const checkBusinessHours = (inputTime, openingTime, closingTime) => {
	if (inputTime < openingTime || inputTime >= closingTime) {
		throw {
			status: 400,
			message: 'Reservation time is outside the restaurant operating hours.',
		};
	}
};

/**
 * Middleware to check if time isn't right before closing
 */
const checkBeforeClosingTime = (inputTime, beforeClosingTime, closingTime) => {
	if (inputTime > beforeClosingTime && inputTime < closingTime) {
		throw {
			status: 400,
			message: 'Restaurant closes soon. Please choose an earlier time.',
		};
	}
};

/**
 * Middleware to check if the time has passed
 */
const checkPastTime = (inputTimeStamp, currentTimeStamp) => {
	if (inputTimeStamp <= currentTimeStamp) {
		throw { status: 400, message: 'Please choose a future time.' };
	}
};

/**
 * Middleware to check for valid time
 */
const checkTimeValidity = (req, res, next) => {
	const { data: { reservation_date, reservation_time } = {} } = req.body;
	const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
	if (!regex.test(reservation_time)) {
		throw { status: 400, message: 'reservation_time is invalid' };
	}

	const today = new Date();

	// Converts the inputted time to an epoch timestamp
	const dateObj = new Date(`${reservation_date} ${reservation_time}`);
	const inputTime = Number(reservation_time.split(':').join(''));

	const openingTime = 1030;
	const beforeClosingTime = 2130;
	const closingTime = 2230;

	// Converts the inputted time to an epoch timestamp
	const inputTimeStamp = dateObj.getTime();
	// Converts the current time to an epoch timestamp
	const currentTimeStamp = today.getTime();

	checkBusinessHours(inputTime, openingTime, closingTime);
	checkBeforeClosingTime(inputTime, beforeClosingTime, closingTime);
	checkPastTime(inputTimeStamp, currentTimeStamp);

	return next();
};

/**
 * Middleware to check if people is zero
 */
const checkPeople = (req, res, next) => {
	const { data: { people } = {} } = req.body;
	if (people === 0) {
		throw {
			status: 400,
			message: 'Please enter a number of people greater than zero.',
		};
	}
	return next();
};

/**
 * Middlewares to check if reservation status is valid
 */
const checkSeatedStatus = (req, res, next) => {
	const { data: { status } = {} } = req.body;
	if (status === 'seated') {
		throw {
			status: 400,
			message: 'Reservation status cannot be seated.',
		};
	}
	return next();
};

const checkFinishedStatus = (req, res, next) => {
	const { data: { status } = {} } = req.body;
	if (status === 'finished') {
		throw {
			status: 400,
			message: 'Reservation status cannot be finished.',
		};
	}
	return next();
};

/**
 * Middleware to check for unknown status
 */
const checkUnknownStatus = (req, res, next) => {
	const { data: { status } = {} } = req.body;
	if (status === 'unknown') {
		throw {
			status: 400,
			message: 'Reservation status cannot be unknown.',
		};
	}
	return next();
};

/**
 * Middleware to check if status is currently finished
 */
const checkIfCurrentlyFinished = (req, res, next) => {
	const { reservation } = res.locals;
	if (reservation.status === 'finished') {
		throw {
			status: 400,
			message: 'A finished reservation cannot be updated.',
		};
	}
	return next();
};
//////////////////////////////////////////////
/// ---MIDDLEWARE ABOVE, HANDLERS BELOW--- ///
//////////////////////////////////////////////
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
		const { data } = req.body;
		const reservation = await reservationsService.create(data);

		res.status(201).json({ data: reservation });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

/**
 * Read handler for reservation resources
 */
const read = (req, res) => {
	const { reservation } = res.locals;
	return res.status(200).json({ data: reservation });
};

/**
 * Update handler for reservation resources
 */
const update = async (req, res, next) => {
	const { reservation_id } = req.params;
	const { status } = req.body.data;
	try {
		await reservationsService.update(reservation_id, status);
		res.status(200).json({ data: { status: status } });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	list: [asyncErrorBoundary(reservationsExists), asyncErrorBoundary(list)],
	create: [
		dataExists,
		checkRequiredFields,
		checkTypes,
		checkDateFormat,
		checkTuesday,
		checkPastDate,
		checkTimeValidity,
		checkPeople,
		checkSeatedStatus,
		checkFinishedStatus,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExistsById), asyncErrorBoundary(read)],
	update: [
		dataExists,
		reservationExistsById,
		checkUnknownStatus,
		checkIfCurrentlyFinished,
		asyncErrorBoundary(update),
	],
};
