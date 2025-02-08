import { Request, Response } from 'express';
import { CardController } from '../../../src/api/controller/card.controller';
import { CardService } from '../../../src/domain/service/card.service';
import { CardRepository } from '../../../src/infrastructure/repository/card.repository';
import { Card } from '../../../src/domain/type/card.type';
import { Category } from '../../../src/domain/type/category.type';

jest.mock('../../../src/domain/service/card.service');

describe('CardController', () => {
  let mockedCardRepository: jest.Mocked<CardRepository>;
  let cardController: CardController;
  let mockedCardService: jest.Mocked<CardService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockedCardRepository = {} as jest.Mocked<CardRepository>;
    mockedCardService = new CardService(mockedCardRepository) as jest.Mocked<CardService>;
    cardController = new CardController(mockedCardService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  const mockCards: Card[] = [
    {
      id: '1', question: 'What is 2+2?', answer: '4', tag: '1',
      lastAnswerDate: new Date(),
      nextAnswerDate: new Date(),
      category: Category.FIRST
    },
    {
      id: '2', question: 'What is 3+3?', answer: '6', tag: '1',
      lastAnswerDate: new Date(),
      nextAnswerDate: new Date(),
      category: Category.FIRST
    },
  ];
  describe('getAllCards', () => {
    it('should return all cards with query parameters', async () => {
      
      mockedCardService.getAllCards.mockResolvedValue(mockCards);

      req.query = { tag: '1' };

      await cardController.getAllCards(req as Request, res as Response);

      expect(mockedCardService.getAllCards).toHaveBeenCalledWith({ tag: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCards);
    });

    it('should handle errors', async () => {
      mockedCardService.getAllCards.mockRejectedValue(new Error('Database error'));

      req.query = {};

      await cardController.getAllCards(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad request' });
    });
  });

  describe('createCardRequest', () => {
    it('should create a new card and return it', async () => {
      const mockCard = mockCards[0];
      mockedCardService.createCard.mockResolvedValue(mockCard);

      req.body = { question: 'What is 2+2?', answer: '4', tag: '1' };

      await cardController.createCardRequest(req as Request, res as Response);

      expect(mockedCardService.createCard).toHaveBeenCalledWith({
        question: 'What is 2+2?',
        answer: '4',
        tag: '1',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCard);
    });

    it('should handle errors', async () => {
      mockedCardService.createCard.mockRejectedValue(new Error('Invalid card data'));

      req.body = { question: 'What is 2+2?', answer: '4', tag: '1' };

      await cardController.createCardRequest(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad request' });
    });
  });
});