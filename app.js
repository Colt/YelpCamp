const express = require('express');
const path = require('path');1
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./db/models/campground');
const app = express();
const connectDB = require('./db')
const port = process.env.PORT || 3000
const wrapAsync = require('./utils/wrapAsync')
const AppError = require('./utils/AppError')

// server settings
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//connect to DB
connectDB()


// Home
app.get('/', (req, res) => {
    res.render('home')
});

// Index 
app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// Get form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// Create in crud
app.post('/campgrounds', wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


// Read or Show in crud
// I could have wrapped this inside wrapAsync. But i used try catch here instead.
app.get('/campgrounds/:id', async (req, res,next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        if (!campground) res.send("404")
        res.render('campgrounds/show', { campground });
    } catch (error) {
        next(error)
    }

});

// Get edit form
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res , next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))


// Edit in crud
app.put('/campgrounds/:id', wrapAsync(async (req, res ,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Delete in crud
app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


// 404 route
app.use((req,res) => {
    res.status(404).send("🙊 404")
})

//This will catch every error that comes into this point and will send generic error message
app.use((err,req,res,next) => {
    console.error(`this is \n ${err}\n`)
    res.status(500).send("Sth went wrong")
})

// Server Listens
app.listen(port, () => {
    console.log('Serving on port 3000')
})