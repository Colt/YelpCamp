const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const app = express();
const database = "yelp-camp"

//connecting to DB
mongoose
    .connect(`mongodb://127.0.0.1:27017/${database}`, { useNewUrlParser: true })
    .then(console.log(`Mongoose connected to "${database}"!`))
    .catch(e => {
        console.error('Connection error', e.message)
    })


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//parent function : wrapAsync
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err => next(err))
    }
}


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.post('/campgrounds', wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

// I could have wrapped this inside wrapAsync. But i used try catch here instead.
app.get('/campgrounds/:id', async (req, res,next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/show', { campground });
    } catch (error) {
        next(error)
    }

});

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res , next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', wrapAsync(async (req, res ,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));


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


app.listen(3000, () => {
    console.log('Serving on port 3000')
})