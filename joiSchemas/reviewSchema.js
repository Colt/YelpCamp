const Joi = require('joi')

const reviewJoiSchema = Joi.object({
    review : Joi.object({
        body : Joi.string().required().min(3).max(300),
        rating : Joi.number().required().min(0).max(5),
    }).required()
})

module.exports = reviewJoiSchema