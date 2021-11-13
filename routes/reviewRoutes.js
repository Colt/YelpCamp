

// post reviews
app.post('/campgrounds/:id/review',  validateReview, wrapAsync(async(req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete reviews
app.delete('/campgrounds/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id,reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    const campground = await Campground.findById(id);
    campground.reviews.pull(reviewId)
    res.redirect(`/campgrounds/${campground._id}`);
}))