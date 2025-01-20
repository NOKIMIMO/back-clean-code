import { CardService } from "../../../src/domain/service/card.service";
import { CreateCardRequest } from "../../../src/api/dto/card.dto";
import { Card } from "../../../src/domain/type/card.type";
import { Category } from "../../../src/domain/type/category.type";

jest.mock("../../../src/domain/service/card.service");

describe("CardService", () => {
  it("should create a card successfully", async () => {
    const mockCard: Card = {
      id: "1",
      question: "string",
      answer: "string",
      tag: "string",
      category: Category.DONE
    };
    (CardService.createCard as jest.Mock).mockResolvedValue(mockCard);

    const card: CreateCardRequest = {
      question: "What is Jest?",
      answer: "A testing framework for JavaScript",
      tag: "testing",
    };

    const result = await CardService.createCard(card);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result.question).toBe(card.question);
    expect(result.answer).toBe(card.answer);
    expect(result.tag).toBe(card.tag);
  });

  it("should return all cards", async () => {
    const mockCards: Card[] = [
      {
        id: "1",
        question: "What is Jest?",
        answer: "A testing framework for JavaScript",
        tag: "testing",
        category: Category.FIRST
      },
      {
        id: "2",
        question: "What is TypeScript?",
        answer: "A strongly typed superset of JavaScript",
        tag: "typescript",
        category: Category.SECOND
      },
    ];
    (CardService.getAllCards as jest.Mock).mockResolvedValue(mockCards);

    const result = await CardService.getAllCards();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(mockCards.length);
    result.forEach((card, index) => {
      expect(card).toMatchObject(mockCards[index]);
    });
  });

  it("should handle createCard errors", async () => {
    const errorMessage = "Invalid input";
    (CardService.createCard as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const card: CreateCardRequest = {
      question: "",
      answer: "",
      tag: "",
    };

    await expect(CardService.createCard(card)).rejects.toThrow(errorMessage);
  });
});
