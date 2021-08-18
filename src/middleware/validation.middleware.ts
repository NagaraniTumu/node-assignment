import * as Joi from "joi-oid";

export const reqHeaderSchema = Joi.object({
  "transaction-id": Joi.string().required(),
});

export const bookReqParamsSchema = Joi.object({
  book_id: Joi.objectId().required(),
});

export const bookPostReqSchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.array().items(Joi.string()).required(),
  price: Joi.string().required(),
  reviews: Joi.array().items(
    Joi.object({
      reviewer: Joi.string().required(),
      message: Joi.string().required(),
    })
  ),
  publisher: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});

export const bookUpdateReqSchema = Joi.object({
  _id: Joi.objectId().required(),
  name: Joi.string(),
  author: Joi.array().items(Joi.string()),
  price: Joi.string(),
  publisher: Joi.object({
    _id: Joi.objectId().required(),
    name: Joi.string(),
    location: Joi.string(),
  }),
});

