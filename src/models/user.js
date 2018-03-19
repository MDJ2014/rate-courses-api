const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator(value) {
				// Regex from http://emailregex.com
				return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
			},
			message: '{VALUE} is not a valid email address'
		}
	},
	password: {
		type: String,
		required: true
	}
});

// Authenticate input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {
	this.findOne({emailAddress: email})
		.exec((error, user) => {
			if (error) {
				return callback(error);
			} else if (!user) {
				const error = new Error('User not found.');
				error.status = 401;
				return callback(error);
			}

			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					return callback(null, user);
				}
				return callback();
			});
		});
};

// Hash password before saving to database
UserSchema.pre('save', function (next) {
	bcrypt.hash(this.password, 10, (error, hash) => {
		if (error) {
			return next(error);
		}
		this.password = hash;
		next();
	});
});

module.exports = mongoose.model('User', UserSchema);