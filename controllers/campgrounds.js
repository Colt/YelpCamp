const { User, Campground, Review } = require('../models/models');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const db = require("../database/db.js");

module.exports.index = async (req, res, next) => {
  try {
    const { rows: campgrounds } = await db.query("SELECT *, ST_AsGeoJSON(geometry)::json as geometry FROM campgrounds");
    res.render("campgrounds/index", { campgrounds });
  } catch (error) {
    next(error);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};


module.exports.createCampground = async (req, res, next) => {
  try {

    const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    }).send();

    const newCampground = {
      title: req.body.campground.title,
      location: req.body.campground.location,
      price: req.body.campground.price,
      description: req.body.campground.description,
      geometry: geoData.body.features[0].geometry.coordinates,
      images: req.files.map(f => ({ url: f.path, filename: f.filename })),
      authorid: req.user.id,
    };

    const { rows: createdCampground } = await db.query(
      "INSERT INTO campgrounds (title, location, price, description, geometry, images, authorid) " +
      "VALUES ($1, $2, $3, $4, ST_GeographyFromText('POINT(' || $5 || ' ' || $6 || ')'), $7, $8) " +
      "RETURNING *",
      [
        newCampground.title,
        newCampground.location,
        newCampground.price,
        newCampground.description,
        newCampground.geometry[0],
        newCampground.geometry[1],
        newCampground.images,
        newCampground.authorid,
      ]
    );

    req.flash("success", "Campground Created");
    res.redirect(`/campgrounds/${createdCampground[0].id}`);
  } catch (error) {
    next(error);
  }
};

module.exports.showCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
        },
        {
          model: Review,
          include: {
            model: User,
            as: 'author',
          },
          as: 'reviews',
        },
      ],
    });

    if (!campground) {
      req.flash("error", "Campground Doesn't exist");
      return res.redirect("/campgrounds");
    }
    
    const { rows: reviews } = await db.query(
      "SELECT * FROM reviews WHERE campgroundid = $1",
      [id]
    );
    console.log(campground);
    res.render("campgrounds/show", { campground, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: campground } = await db.query("SELECT * FROM campgrounds WHERE id = $1", [id]);

    if (!campground.length) {
      req.flash("error", "Campground Doesn't exist");
      res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground: campground[0] });
  } catch (error) {
    next(error);
  }
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const { title, location, price, description } = req.body.campground;

  try {
    const campground = await Campground.findByPk(id);

    if (!campground) {
      throw new Error('Campground not found');
    }

    // Update the campground properties
    campground.title = title;
    campground.location = location;
    campground.price = price;
    campground.description = description;
    await campground.save();

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));

    // Update the images
    campground.images.push(...imgs);
    await campground.save();

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        // Delete images from cloud storage (assuming you have implemented this logic)
        await cloudinary.uploader.destroy(filename);

        // Remove the deleted images from the campground's images array
        campground.images = campground.images.filter(image => image.filename !== filename);
        await campground.save();
      }
    }

    req.flash("success", "Campground Updated");
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    console.error("Error occurred during campground update:", error);
    req.flash("error", "Failed to update campground");
    res.redirect(`/campgrounds/${id}`);
  }
};


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
  
    try {
      const campground = await Campground.findByPk(id, {
        include: { association: 'reviews' } // Include the 'reviews' association when querying the campground
      });
  
      if (!campground) {
        throw new Error('Campground not found');
      }
  
      // Delete the associated reviews before deleting the campground
      await Review.destroy({ where: { campgroundid: campground.id } });
  
      await campground.destroy();
  
      req.flash("success", "Campground Deleted");
      res.redirect("/campgrounds");
    } catch (error) {
      console.error("Error occurred during campground deletion:", error);
      req.flash("error", "Failed to delete campground");
      res.redirect(`/campgrounds/${id}`);
    }
  };
