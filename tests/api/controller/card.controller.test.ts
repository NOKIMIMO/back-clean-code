import { app } from "../../../src";
import { CreateCardRequest } from "../../../src/api/dto/card.dto";
import { CardService } from "../../../src/domain/service/card.service";
import request from "supertest";
import { Card } from "../../../src/domain/type/card.type";
import { Category } from "../../../src/domain/type/category.type";

const mockCardRepository = {
  createCard: jest.fn(),
  listCards: jest.fn(),
};

const cardService = new CardService(mockCardRepository as any);

jest.mock("../../../src/domain/service/card.service", () => {
  return {
    CardService: jest.fn().mockImplementation(() => cardService),
  };
});

describe("createCardController", () => {
  const validCardData: CreateCardRequest = {
    question: "What is Jest?",
    answer: "A testing framework for JavaScript",
    tag: "testing",
  };

  const invalidCardMissingData: any = {
    answer: "thingy",
  };

  const invalidCardDataType: any = {
    question: "What is Jest?",
    answer: 9,
  };

  it("should create a card successfully and return 201 status", async () => {
    const mockedCard: Card = {
      ...validCardData,
      id: "1",
      category: Category.FIRST,
    };
    mockCardRepository.createCard.mockResolvedValue(mockedCard);

    const response = await request(app)
      .post("/cards")
      .send(validCardData)
      .expect(201);

    expect(mockCardRepository.createCard).toHaveBeenCalledWith(validCardData);
    expect(response.body).toEqual(mockedCard);
    expect(response.status).toBe(201);
  });

  it("should return 400 status because of missing parameter", async () => {
    const response = await request(app)
      .post("/cards")
      .send(invalidCardMissingData)
      .expect(400);

    expect(mockCardRepository.createCard).not.toHaveBeenCalled();
    expect(response.body.error).toBe("Missing property question");
    expect(response.status).toBe(400);
  });

  it("should return 400 status because of wrong parameter type", async () => {
    const response = await request(app)
      .post("/cards")
      .send(invalidCardDataType)
      .expect(400);

    expect(mockCardRepository.createCard).not.toHaveBeenCalled();
    expect(response.body.error).toBe("property : answer must be a string");
    expect(response.status).toBe(400);
  });
});
