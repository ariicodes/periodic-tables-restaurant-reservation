const reservationsService = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */
const list = async (req, res) => {
	const { date } = req.query;
	const reservations = await reservationsService.list(date);
	return res.json({ data: reservations });
};

module.exports = {
	list: asyncErrorBoundary(list),
};
