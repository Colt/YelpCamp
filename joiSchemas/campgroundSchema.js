const Joi = require('joi')

const campgroundJoiSchema = Joi.object({
    campground : Joi.object({
        title : Joi.string().required().min(3).max(30),
        location : Joi.string().required().min(3).max(100),
        price : Joi.number().required().min(0).max(100000),
        image : Joi.string().allow(null, ''),
        description : Joi.string().allow(null, '')
    }).required()
})

module.exports.campgroundJoiSchema = campgroundJoiSchema