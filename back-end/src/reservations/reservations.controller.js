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

module.exports = {
	list,
};
