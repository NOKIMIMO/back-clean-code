import { Request, Response } from 'express';
import { LearningController } from '../../../src/api/controller/learning.controller';
import { CardNotFoundError } from '../../../src/common/errors/card-not-found-error.error';
import { LearningService } from '../../../src/domain/service/learning.service';
import { CardRepository } from '../../../src/infrastructure/repository/card.repository';
import { Card } from '../../../src/domain/type/card.type';
import { Category } from '../../../src/domain/type/category.type';


jest.mock('../../../src/domain/service/learning.service');

describe('LearningController', () => {
  let mockedCardRepository: jest.Mocked<CardRepository>;
  let learningController: LearningController;
  let mockedLearningService: jest.Mocked<LearningService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockedCardRepository = {} as jest.Mocked<CardRepository>;
    mockedLearningService = new LearningService(mockedCardRepository) as jest.Mocked<LearningService>;
    learningController = new LearningController(mockedLearningService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  const mockCards: Card[] = [{
    id: '1', question: 'What is 2+2?', answer: '4', tag: "1",
    lastAnswerDate: new Date(),
    nextAnswerDate: new Date(),
    category: Category.FIRST
  }];

  describe('getTodayQuizz', () => {
    it('should return today\'s quiz cards', async () => {
      mockedLearningService.getTodayQuizz.mockResolvedValue(mockCards);

      req.query = {};

      await learningController.getTodayQuizz(req as Request, res as Response);

      expect(mockedLearningService.getTodayQuizz).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCards.map(card => ({ ...card, tag: card.tag || "" })));
    });

    it('should handle a specific date query', async () => {
      const specificDate = new Date('2023-10-01');
      mockedLearningService.getTodayQuizz.mockResolvedValue(mockCards);

      req.query = { date: specificDate.toISOString() };

      await learningController.getTodayQuizz(req as Request, res as Response);

      expect(mockedLearningService.getTodayQuizz).toHaveBeenCalledWith(specificDate);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCards.map(card => ({ ...card, tag: card.tag || "" })));
    });

    it('should handle errors', async () => {
      mockedLearningService.getTodayQuizz.mockRejectedValue(new Error('Database error'));

      req.query = {};

      await learningController.getTodayQuizz(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad request' });
    });
  });

  describe('answerCard', () => {
    it('should handle a valid card answer', async () => {
      const mockCard = mockCards[0];
      mockedLearningService.answerCard.mockResolvedValue(mockCard);

      req.params = { cardId: '1' };
      req.body = { isValid: true };

      await learningController.answerCard(req as Request, res as Response);

      expect(mockedLearningService.answerCard).toHaveBeenCalledWith({ isValid: true, cardId: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCard);
    });

    it('should handle CardNotFoundError', async () => {
      mockedLearningService.answerCard.mockRejectedValue(new CardNotFoundError('Card not found'));

      req.params = { cardId: '1' };
      req.body = { isValid: true };

      await learningController.answerCard(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });

    it('should handle other errors', async () => {
      mockedLearningService.answerCard.mockRejectedValue(new Error('Database error'));

      req.params = { cardId: '1' };
      req.body = { isValid: true };

      await learningController.answerCard(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad request' });
    });
  });
});