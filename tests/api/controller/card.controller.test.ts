import { app } from "../../../src";
import { createCardRequest } from "../../../src/api/controller/card.controller";
import { CreateCardRequest } from "../../../src/api/dto/card.dto";
import { CardService } from "../../../src/domain/service/card.service";
import request from "supertest";
import { Card } from "../../../src/domain/type/card.type";
import { Category } from "../../../src/domain/type/category.type";
jest.mock("../../../src/domain/service/card.service");
jest.mock("../../../src/domain/service/card.service", () => ({
  createCard: jest.fn(),
}));


describe('createCardController', () => {
    const validCardData: CreateCardRequest = {
        question: "What is Jest?",
        answer: "A testing framework for JavaScript",
        tag: "testing",
      };
    
      const invalidCardData: any = {
        name: "", // invalid name
        type: "Credit",
        balance: 1000,
      };
    
      it("should create a card successfully and return 201 status", async () => {
        const mockedCard: Card = {
          ...validCardData, id: "1",
          category: Category.FIRST
        }; 
        (CardService.createCard as jest.Mock).mockResolvedValue(mockedCard);
    
        const response = await request(app)
          .post("/cards")
          .send(validCardData)
          .expect(201);
    
        expect(response.body).toEqual(mockedCard);
        expect(response.status).toBe(201);
      });
    
      // Test: Invalid Request Body
      it("should return 400 status if request body is invalid", async () => {
        const response = await request(app)
          .post("/cards")
          .send(invalidCardData)
          .expect(400);
    
        expect(response.body.error).toBe("Invalid card data");
        expect(response.status).toBe(400);
      });
});