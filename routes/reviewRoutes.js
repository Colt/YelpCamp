const router = require('express').Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync')
const AppError = require('../utils/AppError')
const Review = require('../db/models/review')
const Campground = require('../db/models/campground')
const reviewJoiSchema = require('../joiSchemas/reviewSchema')


const validateReview = (req,res,next) => {
    const {error} = reviewJoiSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(i => i.message).join(',')
        throw new AppError(msg,400)
    } else{
        next()
    }
}


// post reviews
router.post('/',  validateReview, wrapAsync(async(req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success',"Your review was posted!!")
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete reviews
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id,reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    const campground = await Campground.findById(id);
    campground.reviews.pull(reviewId)
    res.redirect(`/campgrounds/${campground._id}`);
}))


module.exports = router