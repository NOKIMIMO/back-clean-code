import Joi from 'joi';

export const getQuizzOfDateQuerryValidator = Joi.object({
    date:Joi.date().optional(),
})

export const answerQuizzBodyValidator = Joi.object({
    isValid:Joi.boolean().required(),
})

export const answerQuizzParamValidator = Joi.object({
    cardId:Joi.string().required(),
})