const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const CourseSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	estimatedTime: String,
	materialsNeeded: String,
	steps: [{
		stepNumber: Number,
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		}
	}],
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}]
},{usePushEach: true});  //fixes push error

CourseSchema.plugin(deepPopulate);

module.exports = mongoose.model('Course', CourseSchema);

