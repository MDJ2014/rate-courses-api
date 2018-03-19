const express = require('express');
const Course = require('../../models').Course;
const middleware = require('../../middleware');
const Review = require('../../models').Review;
const router = new express.Router();





//GET COURSES
router.get('/', (req, res, next) => {
	Course.find({})
		.select('title')
		.exec((error, courses) => {
			if (error) {
				return next(error);
			}
			return res.json(courses);
		});
});

//POST a new course
router.post('/', middleware.authenticate, (req, res, next) => {
	Course.create(req.body, error => {
		if (error) {
			return next(error);
		}

		res.location('/');
		return res.end();
	});
});


//GET INDIVIDUAL COURSE
router.get('/:courseId', (req, res, next) => {
	Course.findById(req.params.courseId)
		.populate({
			path: 'user',
			select: 'fullName'
		})
		.populate('reviews')
		.deepPopulate('reviews.user', {
			populate: {
				'reviews.user': {
					select: 'fullName'
				}
			}
		})
		.exec((error, course) => {
			if (error) {
				return next(error);
			}

			return res.json(course);
		});
});


//UPDATE A COURSE
router.put('/:courseId', middleware.authenticate, (req, res, next) => {
	Course.findByIdAndUpdate(req.params.courseId, {$set: req.body}, error => {
		if (error) {
			return next(error);
		}

		return next();
	});
});



//POST a course review
router.post('/:courseId/reviews', middleware.authenticate, (req, res, next) => {
	Course.findById(req.params.courseId)
	.populate('user')
	.populate('reviews')
	.exec(function(err, course) {
		if (err) {
			 return next(err);
		}

	// Ensure review user is not the owner of the course
	if (req.user._id === course.user) {
		const error = new Error('Course creator cannot review that course.');
		error.status = 401;
		return next(error);
	}

	var review = new Review(req.body);
	review.postedOn = Date.now();
	course.reviews.push(review);


	review.save(req.body, function (err){
			if (err){
				return next(err);
			}
	 
	})
		course.save(error => {
			if (error) {
				return next(error);
			}
			res.location('/:courseID');
            res.status(201).json();
		
		});
	});
});


module.exports = router;
