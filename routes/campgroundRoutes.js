const router = require('express').Router()
const wrapAsync = require('../utils/wrapAsync')
const campgroundJoiSchema = require('../joiSchemas/campgroundSchema')
const Campground = require('../db/models/campground');
const AppError = require('../utils/AppError')


const validateCampground = (req,res,next) => {
    const {error} = campgroundJoiSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(i => i.message).join(',')
        throw new AppError(msg,400)
    } else{
        next()
    }
}


// Index 
router.get('/', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// Get form
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

// Create in crud
router.post('/', validateCampground, wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Succesfully created a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
}))


// Read or Show in crud
// I could have wrapped this inside wrapAsync. But i used try catch here instead.
router.get('/:id', async (req, res,next) => {
    try {
        const campground = await Campground.findById(req.params.id).populate('reviews')
        if (!campground) res.send("404")
        res.render('campgrounds/show', { campground });
    } catch (error) {
        next(error)
    }

});

// Get edit form
router.get('/:id/edit', wrapAsync(async (req, res , next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

// Edit in crud
router.put('/:id', validateCampground, wrapAsync(async (req, res ,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Delete in crud
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = router