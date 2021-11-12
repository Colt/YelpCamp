const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Review model has a one to many relationship with Campground model. Which means every campground
// doucment has to fit to 16mb threshold. If the reviews array is going to be larger than couple thousands we have to
// use one to bajjilions relationship.

const reviewSchema = new Schema({
    body : String,
    rating : Number,
})

module.exports = mongoose.model('Review',reviewSchema)