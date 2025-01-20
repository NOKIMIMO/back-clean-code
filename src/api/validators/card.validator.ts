import Joi from 'joi';

export const createCardBodyValidator = Joi.object({
    question:Joi.string().required(),
    answer: Joi.string().required(),
    tag:Joi.string().required(),
})

export const listCardQuerryValidator = Joi.object({
    tag: Joi.array<string[]>().optional()
})

