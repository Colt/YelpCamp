const mongoose = require('mongoose');
const database = "yelp-camp"


const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://localhost:27017/${database}`,{
            useUnifiedTopology : true,
            useNewUrlParser : true,
        })
        console.log(`Mongoose Connected to ${database}!!`)
    } catch (err) {
        console.error(err);
    } 
}


module.exports = connectDB;