const reservationsService = require('./reservations.service');

/**
 * List handler for reservation resources
 */
const list = async (req, res, next) => {
	const { date } = req.query;
	const reservation = await reservationsService.list(date);
	if (reservation) {
		res.json({ data: reservation });
	}
	next({ status: 404, message: `No reservations found for ${date}` });
};

/**
 * Create handler for reservation resources
 */
const create = async (req, res) => {
	const newReservation = await reservationsService.create(req.body.data);
	res.status(201).json({ data: newReservation });
};

module.exports = {
	list,
  create,
};
