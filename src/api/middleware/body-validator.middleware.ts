import { NextFunction, Response, Request } from "express";
import Joi from "joi";

type ValidatorMap = {
  body?: Joi.ObjectSchema<any> | null;
  query?: Joi.ObjectSchema<any> | null;
  params?: Joi.ObjectSchema<any> | null;
};

const defaultValidatorsLocation:  ValidatorMap = {
  body: null,
  query: null,
  params: null,
};

export const validatorMiddleware = (validators: ValidatorMap) => {
    return (request: Request, response: Response, next: NextFunction): void => {
      try {

        const validationTargets: { location: 'body' | 'query' | 'params'; validator: Joi.ObjectSchema<any> | null }[] = [
          { location: 'body', validator: validators.body ?? null},
          { location: 'query', validator: validators.query ?? null},
          { location: 'params', validator: validators.params ?? null},
        ];

        for (const { location, validator } of validationTargets) {
          if (validator) {
            const data = request[location];
  
            const { error, value } = validator.validate(data, { stripUnknown: true });
  
            if (error) {
              response.status(400).json({ error: error.details[0].message, location });
              return;
            }
  
            request[location] = value;
          }
        }
        next();
      } catch (err) {
        console.error(err);
        response.status(500).json({ error: 'Internal Server Error' });
        return;
      }
    };
  };