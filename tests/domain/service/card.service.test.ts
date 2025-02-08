import { CardService } from "../../../src/domain/service/card.service";
import { CreateCardRequest, ListCardRequest } from "../../../src/api/dto/card.dto";
import { Card } from "../../../src/domain/type/card.type";
import { Category } from "../../../src/domain/type/category.type";
import { CardRepository } from "../../../src/infrastructure/repository/card.repository";
import { CardDAO } from "../../../src/infrastructure/dao/card.dao";

describe("CardService", () => {
  let cardService: CardService;
  let cardRepository: jest.Mocked<CardRepository>;

  beforeEach(() => {
    cardRepository = {
      createCard: jest.fn(),
      listCards: jest.fn(),
    } as unknown as jest.Mocked<CardRepository>;

    cardService = new CardService(cardRepository);
  });

  it("should create a card successfully", async () => {

    const cardRequest: CreateCardRequest = {
      question: "What is Jest?",
      answer: "A testing framework for JavaScript",
      tag: "testing",
    };

    const mockCard: CardDAO = {
      id: "1",
      question: cardRequest.question,
      answer: cardRequest.answer,
      tag: cardRequest.tag || "",
      category: Category.FIRST,
      lastAnswerDate: new Date(),
      nextAnswerDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    cardRepository.createCard.mockResolvedValue(mockCard);

    const result = await cardService.createCard(cardRequest);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result.question).toBe(cardRequest.question);
    expect(result.answer).toBe(cardRequest.answer);
    expect(result.tag).toBe(cardRequest.tag);

    expect(cardRepository.createCard).toHaveBeenCalledWith(cardRequest);
  });

  it("should handle createCard errors", async () => {
    const errorMessage = "Invalid input";

    const card: CreateCardRequest = {
      question: "",
      answer: "",
      tag: "",
    };

    await expect(cardService.createCard(card)).rejects.toThrow(errorMessage);
  });

  it("should be called with the correct filter", async () => {

    const filter : ListCardRequest = {
      tag: ["testing"]
    }

    await cardService.getAllCards(filter);
    expect(cardRepository.listCards).toHaveBeenCalledWith(filter);
 
  });

});
