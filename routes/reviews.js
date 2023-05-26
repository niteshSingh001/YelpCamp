const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const Review = require('../models/review.js');
const { reviewSchema } = require('../schemas.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Created a new Review')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;