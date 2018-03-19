'use strict';

// Load modules
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const seeder = require('mongoose-seeder');

// Mongodb connection
mongoose.connect('mongodb://localhost:27017/rate-courses');
const db = mongoose.connection;

const app = express();

// Mongo error
db.on('error', console.error.bind(console, 'connection error:'));

//establish a connection and seed the database
db.once('open', () => {
	console.log('Connection to database successful');

		console.log('Dropping database & adding seed data');
		seeder.seed(require('./data/data.json'))
			.then(() => {
				console.log('Successfully seeded database');
			})
			.catch(error => {
				console.error('Error seeded database');
				console.error(error);
			});
	});

// Set our port
app.set('port', process.env.PORT || 5000);

// Morgan gives us http request logging
app.use(morgan('dev'));

// Parse Incomming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// Setup api routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Catch 404 and forward to global error handler
app.use((req, res, next) => {
	const err = new Error('File Not Found');
	err.status = 404;
	next(err);
});

// Express's global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json(err);
});

// Start listening on our port
const server = app.listen(app.get('port'), () => {
	console.log('Express server is listening on port ' + server.address().port);
});

