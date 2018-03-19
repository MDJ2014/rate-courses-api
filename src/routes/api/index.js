const express = require('express');

const router = new express.Router();

const userRoutes = require('./users');
router.use('/users', userRoutes);

const courseRoutes = require('./courses');
router.use('/courses', courseRoutes);

module.exports = router;