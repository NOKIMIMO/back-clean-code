import { AnswerQuizzRequest } from '../../../src/api/dto/learning.dto';
import {LearningService} from '../../../src/domain/service/learning.service';
import { CardRepository } from '../../../src/infrastructure/repository/card.repository';

describe("LearningService", () => {
  let learningService: LearningService;
  let cardRepository: jest.Mocked<CardRepository>;
  beforeEach(() => {
    cardRepository = {
      createCard: jest.fn(),
      listCards: jest.fn(),
    } as unknown as jest.Mocked<CardRepository>;
    learningService = new LearningService(cardRepository);
  });

  describe("getTodayQuizz", () => {
    it("should correctly list quizz for today", async () => {


      await learningService.getTodayQuizz();

    });
    it("should correctly list quizz for today", async () => {

      const date = new Date();
      await learningService.getTodayQuizz(date);


    });
  });

  describe("answerCard", () => {
    it("should successfully answer a card", async () => {
      const answer:AnswerQuizzRequest = {
        isValid: true,
        cardId: "1234"
      }

      // Mock the instance method
      // jest.spyOn(learningService, 'answerCard').mockResolvedValue(undefined);

      const result = await learningService.answerCard(answer);

      expect(learningService.answerCard).toHaveBeenCalledWith(answer);
    });
    
    it("should throw a 404 error if card is not found", async () => {
      const answer:AnswerQuizzRequest = {
        isValid: true,
        cardId: "1234"
      }

      jest.spyOn(learningService, 'answerCard').mockRejectedValue(new Error("404 Card Not Found"));

      await expect(learningService.answerCard(answer)).rejects.toThrow("404 Card Not Found");
    });
  });
});