const tablesService = require('./tables.service');
const reservationsService = require('../reservations/reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

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
	const { data: { table_name, capacity } = {} } = req.body;

	const requiredFields = {
		table_name: 'A table_name property is required.',
		capacity: 'A capacity property is required.',
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
 * Middleware to check name length
 */
const checkNameLength = (req, res, next) => {
	const { data: { table_name } = {} } = req.body;
	if (table_name.length < 2) {
		return next({
			status: 400,
			message: `table_name must be at least 2 characters long.`,
		});
	}
	return next();
};

/**
 * Middleware to check capacity validity
 */
const checkCapacity = (req, res, next) => {
	const { data: { capacity } = {} } = req.body;
	if (capacity === 0 || typeof capacity !== 'number') {
		return next({
			status: 400,
			message: `capacity must be a number greater than 0.`,
		});
	}
	return next();
};

/**
 * Middleware to check if reservation_id is present
 */
const reservationIdPresent = async (req, res, next) => {
	const { data: { reservation_id } = {} } = req.body;
	if (
		!reservation_id ||
		reservation_id === null ||
		reservation_id === undefined
	) {
		return next({
			status: 400,
			message: `reservation_id does not exist.`,
		});
	}
	return next();
};

/**
 * Middleware to check if reservation_id exists
 */
const reservationIdExists = async (req, res, next) => {
	const { reservation_id } = req.body.data;
	const reservation = await reservationsService.read(reservation_id);
	if (!reservation) {
		return next({
			status: 404,
			message: `reservation_id ${reservation_id} does not exist.`,
		});
	}
	return next();
};

/**
 * Middleware to check if table has sufficient capacity
 */
const tableHasSufficientCapacity = async (req, res, next) => {
	const { table_id } = req.params;
	const { reservation_id } = req.body.data;
	const table = await tablesService.read(table_id);
	const reservation = await reservationsService.read(reservation_id);
	if (table.capacity < reservation.people) {
		return next({
			status: 400,
			message: `table_id ${table_id} does not have sufficient capacity.`,
		});
	}
	return next();
};

/**
 * Middleware to check if table is occupied
 */
const tableIsOccupied = async (req, res, next) => {
	const { table_id } = req.params;
	const table = await tablesService.read(table_id);
	if (table.reservation_id) {
		return next({
			status: 400,
			message: `Table ${table.table_name} is occupied.`,
		});
	}
	return next();
};

//////////////////////////////////////////////
/// ---MIDDLEWARE ABOVE, HANDLERS BELOW--- ///
//////////////////////////////////////////////

/**
 * List handler for table resources
 */
const list = async (req, res) => {
	const data = await tablesService.list();
	res.json({ data });
};

/**
 * Create handler for table resources
 */
const create = async (req, res) => {
	try {
		const { data: { table_name, capacity } = {} } = req.body;
		const newTable = {
			table_name,
			capacity,
		};

		await tablesService.create(newTable);
		res.status(201).json({ data: newTable });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

/**
 * Update handler for table resources
 */
const update = async (req, res) => {
	const { table_id } = req.params;
	const { reservation_id } = req.body.data;

	try {
		await tablesService.update({ table_id, reservation_id });
		res.status(200).json({ data: { reservation_id: reservation_id } });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	list: asyncErrorBoundary(list),
	create: [
		dataExists,
		checkRequiredFields,
		checkNameLength,
		checkCapacity,
		asyncErrorBoundary(create),
	],
	update: [
		dataExists,
		reservationIdPresent,
		reservationIdExists,
		tableHasSufficientCapacity,
		tableIsOccupied,
		asyncErrorBoundary(update),
	],
};
