const joi = require("joi");
module.exports.campgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      location: joi.string().required(),
      description: joi.string().required(),
      image: joi.string().required(),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  Review: joi
    .object({
      rating: joi.number().required(),
      body: joi.string().required(),
    })
    .required(),
});
