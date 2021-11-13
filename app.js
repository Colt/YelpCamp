// dependencies
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')

// local modules
const campgroundRoutes = require('./routes/campgroundRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const connectDB = require('./db')
const AppError = require('./utils/AppError')

const sessionConfig = {
    secret : 'Thisshouldbeabettersecret',
    resave : false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
const port = process.env.PORT || 3000
const app = express();

// server settings
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(session(sessionConfig))
app.use(flash())

//connect to DB
connectDB()

//flash middleware
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

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