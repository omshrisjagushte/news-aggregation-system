import Joi from 'joi';

export const authValidation = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const feedValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    description: Joi.string().allow(''),
    category_id: Joi.number().allow(null),
  }),
  
  update: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(''),
    active: Joi.boolean(),
    category_id: Joi.number().allow(null),
  }),
};

export const categoryValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    color: Joi.string().regex(/^#[0-9A-F]{6}$/i),
    icon: Joi.string(),
  }),
};

export const validate = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
  }
  return value;
};
