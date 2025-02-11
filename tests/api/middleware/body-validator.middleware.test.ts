import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validatorMiddleware } from "../../../src/api/middleware/body-validator.middleware";

describe("validatorMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should pass validation and call next for valid body data", () => {
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    });

    mockRequest.body = { name: "John Doe", age: 30 };

    const middleware = validatorMiddleware({ body: bodySchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.body).toEqual({ name: "John Doe", age: 30 });
  });

  it("should sanitize and pass valid data with extra fields", () => {
    const bodySchema = Joi.object({
      name: Joi.string().required(),
    });

    mockRequest.body = { name: "John Doe", age: 30 };

    const middleware = validatorMiddleware({ body: bodySchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.body).toEqual({ name: "John Doe" }); // Extra fields are stripped
  });

  it("should respond with 400 if body data is invalid", () => {
    const bodySchema = Joi.object({
      name: Joi.string().required(),
    });

    mockRequest.body = { age: 30 };

    const middleware = validatorMiddleware({ body: bodySchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: expect.any(String),
      location: "body",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should pass validation for valid query data", () => {
    const querySchema = Joi.object({
      search: Joi.string().required(),
    });

    mockRequest.query = { search: "example" };

    const middleware = validatorMiddleware({ query: querySchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.query).toEqual({ search: "example" });
  });

  it("should respond with 400 if query data is invalid", () => {
    const querySchema = Joi.object({
      search: Joi.string().required(),
    });

    mockRequest.query = {};

    const middleware = validatorMiddleware({ query: querySchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: expect.any(String),
      location: "query",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should pass validation for valid params data", () => {
    const paramsSchema = Joi.object({
      id: Joi.string().uuid().required(),
    });

    mockRequest.params = { id: "123e4567-e89b-12d3-a456-426614174000" };

    const middleware = validatorMiddleware({ params: paramsSchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.params).toEqual({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
  });

  it("should respond with 400 if params data is invalid", () => {
    const paramsSchema = Joi.object({
      id: Joi.string().uuid().required(),
    });

    mockRequest.params = { id: "invalid-uuid" };

    const middleware = validatorMiddleware({ params: paramsSchema });

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: expect.any(String),
      location: "params",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

});
