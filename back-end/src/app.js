const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const errorHandler = require('./errors/errorHandler');
const notFound = require('./errors/notFound');
const reservationsRouter = require('./reservations/reservations.router');
const tablesRouter = require('./tables/tables.router');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (React app)
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/reservations', reservationsRouter);
app.use('/tables', tablesRouter);

// Catch-all route to serve React app's index.html
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
