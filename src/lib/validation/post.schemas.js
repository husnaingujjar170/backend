const Joi = require('joi');

const createPostSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  content: Joi.string()
    .min(10)
    .max(5000)
    .required()
    .messages({
      'string.min': 'Content must be at least 10 characters long',
      'string.max': 'Content cannot exceed 5000 characters',
      'any.required': 'Content is required'
    })
});

const updatePostSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .optional(),
  
  content: Joi.string()
    .min(10)
    .max(5000)
    .optional()
}).min(1);

const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Comment cannot be empty',
      'string.max': 'Comment cannot exceed 1000 characters',
      'any.required': 'Comment content is required'
    })
});

const updateCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema
};