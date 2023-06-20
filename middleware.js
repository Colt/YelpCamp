const { sequelize } = require('./database/database');
const db = require("./database/db.js");
const {campgroundSchema, reviewSchema} = require("./schemas")
const ExpressError = require('./utils/ExpressError');
const { Campground, Review, User } = require('./models/models');

module.exports.isLoggedIn = (req,res,next) => { 
    if(!req.isAuthenticated()){
      req.flash("error", "You must be signed in to perform this action");
      return res.redirect("/login") //the return statemnt is necessary otherwise the code below would still run
  }
  next();
}

module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(",")
      throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }


  module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
      const campground = await Campground.findByPk(id);
      if (!campground) {
        req.flash("error", "Campground doesn't exist");
        return res.redirect(`/campgrounds/${id}`);
      }
      if (campground.authorid !== req.user.id) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/campgrounds/${id}`);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    try {
      const review = await Review.findByPk(reviewId);
      if (!req.user) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/campgrounds/${id}`);
      } else if (review.authorid !== req.user.id) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/campgrounds/${id}`);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
  

  module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(",")
      throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }
