const basicAuth = require('basic-auth');
const User = require('../models').User;






function authenticate(req, res, next) {
	const credentials = basicAuth(req);

	if (credentials) {
		User.authenticate(credentials.name, credentials.pass, (error, user) => {
			if (error) {
				return next(error);
			}

			if (!user) {
				const error = new Error('Credentials do not match');
				error.status = 404;
				return next(error);
			}

			req.user = user;
			return next();
		});
	} else {
		const error = new Error('You must be logged in to perform this action.');
		error.status = 401;
		return next(error);
	}
}

module.exports = {
	authenticate
};