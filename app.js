const express = require('express');
const path = require('path');1
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');


const app = express();
const connectDB = require('./db')
const port = process.env.PORT || 3000

const AppError = require('./utils/AppError')

const campgroundRoutes = require('./routes/campgroundRoutes')
const reviewRoutes = require('./routes/reviewRoutes')


// server settings
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//connect to DB
connectDB()

//campgroundRoutes
app.use('/campgrounds',campgroundRoutes)

//reviewRoutes
app.use('/campgrounds/:id/reviews',reviewRoutes)

// Home
app.get('/', (req, res) => {
    res.render('home')
});


// 404 route
app.all('*',(req,res,next) => {
    next(new AppError("🙊 Page not found!!",404))
})

//This will catch every error that comes into this point and will send generic error message
app.use((err,req,res,next) => {
    console.error(`\n\t🤦‍♂️${err.stack}`)
    const {status =500, message="Something went wrong!"} = err;
    if (err instanceof AppError) {
        res.status(status).render('campgrounds/error',{message,status})
        return
    }
    //Below line handles internal errors
    res.status(500).render('campgrounds/unexpected_error')
})

// Server Listens
app.listen(port, () => {
    console.log('Serving on port 3000')
})