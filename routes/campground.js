const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const Campground = require('../models/campground.js');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);




router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));





module.exports = router;