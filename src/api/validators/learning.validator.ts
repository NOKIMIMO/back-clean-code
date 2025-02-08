import Joi from 'joi';

export const getQuizzOfDateQuerryValidator = Joi.object({
    date:Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const answerQuizzBodyValidator = Joi.object({
    isValid:Joi.boolean().required(),
})

export const answerQuizzParamValidator = Joi.object({
    cardId:Joi.string().required(),
})