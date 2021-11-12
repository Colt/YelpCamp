const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Review model has a one to many relationship with Campground model. Which means every campground
// doucment has to fit to 16mb threshold. If the reviews array is going to be larger than couple thousands we have to
// use one to bajjilions relationship.

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},{ timestamps: true });


module.exports = mongoose.model('Campground', CampgroundSchema);