const { Campground, Review } = require('../models/models'); // Assuming you have imported the models
const db = require("../database/db.js");


module.exports.createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review } = req.body;

    const campground = await Campground.findByPk(id);
    if (!campground) {
      throw new Error('Campground not found');
    }
    const newReview = {
      body: review.body,
      rating: review.rating,
      authorid: req.user.id,
      campgroundid:id
    };
    const createdReview = await Review.create(newReview);
    await campground.addReview(createdReview);
    req.flash("success", "Review Submitted");
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByPk(id);
    if (!campground) {
      throw new Error('Campground not found');
    }
    const review = await Review.findByPk(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    await review.destroy();
    req.flash("success", "Review Deleted");
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(error);
  }
};
