import {LearningService} from '../../../src/domain/service/learning.service'
import { Card } from "../../../src/domain/type/card.type";
import { Category } from "../../../src/domain/type/category.type";

jest.mock('../../../src/domain/service/learning.service')

describe("learningServices.getTodayQuizz", () => {
    it("Should get todayQuizzes", async () => {
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

          (LearningService.getTodayQuizz as jest.Mock).mockReturnValue(mockCards);

          const date = new Date();

        const result = LearningService.getTodayQuizz(date);

        expect(Array.isArray(result)).toBe(true); 
        expect(result).toHaveLength(mockCards.length); 
        expect(result).toEqual(mockCards); 
    })
});

describe("LearningService.answerCard", () => {
    it("should successfully answer a card", async () => {
      // Arrange: Mock the response for success
      const cardId = "1234";
      const mockRequestBody = true;
      (LearningService.answerCard as jest.Mock).mockResolvedValue(undefined); 
      const result = await LearningService.answerCard(cardId, mockRequestBody);
  
      expect(result).toBeUndefined();
      expect(LearningService.answerCard).toHaveBeenCalledWith(cardId, mockRequestBody);
    });
  
    it("should throw a 400 error for invalid input", async () => {
      // Arrange: Mock an error for bad request
      const cardId = "1234";
      const mockRequestBody = { isValid: undefined }; // Invalid body
      (LearningService.answerCard as jest.Mock).mockRejectedValue(new Error("400 Bad Request"));
  
      // Act & Assert: Expect the method to throw an error
      await expect(LearningService.answerCard(cardId, mockRequestBody)).rejects.toThrow("400 Bad Request");
    });
  
    it("should throw a 404 error if card is not found", async () => {
      // Arrange: Mock an error for card not found
      const cardId = "5678";
      const mockRequestBody = { isValid: true };
      (LearningService.answerCard as jest.Mock).mockRejectedValue(new Error("404 Card Not Found"));
  
      // Act & Assert: Expect the method to throw an error
      await expect(LearningService.answerCard(cardId, mockRequestBody)).rejects.toThrow("404 Card Not Found");
    });
  });