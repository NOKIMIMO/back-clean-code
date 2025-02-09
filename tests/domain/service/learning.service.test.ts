import { DataSource } from "typeorm";
import { UpdateCard } from "../../../src/api/dto/card.dto";
import { CardUpdateAction } from "../../../src/domain/enum/card-update.enum";
import { LearningService } from "../../../src/domain/service/learning.service";
import { Card } from "../../../src/domain/type/card.type";
import { CardRepository } from "../../../src/infrastructure/repository/card.repository";
import { Category } from "../../../src/domain/type/category.type";
import { CardDAO } from "../../../src/infrastructure/dao/card.dao";


jest.mock('../../../src/infrastructure/repository/card.repository');

describe('LearningService', () => {
  let mockedDB: jest.Mocked<DataSource>;
  let learningService: LearningService;
  let cardRepository: jest.Mocked<CardRepository>;

  beforeEach(() => {
    let mockedDB = {} as jest.Mocked<DataSource>;
    cardRepository = new CardRepository(mockedDB) as jest.Mocked<CardRepository>;
    learningService = new LearningService(cardRepository);
  });

  describe('getTodayQuizz', () => {
    it('should return cards for today\'s quiz when no date is provided', async () => {
      const mockCards: CardDAO[] = [
        {
          id: '1', question: 'What is 2+2?', answer: '4', tag: '1',
          category: Category.FIRST,
          createdAt: new Date(),
          updatedAt: new Date(),
          nextAnswerDate: new Date(),
          lastAnswerDate: new Date()
        },
        {
          id: '2', question: 'What is 3+3?', answer: '6', tag: '2',
          lastAnswerDate: new Date(),
          nextAnswerDate: new Date(),
          category: Category.FIRST,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      cardRepository.getCardForQuizz.mockResolvedValue(mockCards);

      const result = await learningService.getTodayQuizz();

      expect(cardRepository.getCardForQuizz).toHaveBeenCalledWith({ date: expect.any(Date) });
      expect(result).toEqual(mockCards);
    });

    it('should return cards for a specific date when provided', async () => {
      const mockCards: CardDAO[] = [
        {
          id: '1', question: 'What is 2+2?', answer: '4', tag: '1',
          lastAnswerDate: new Date(),
          nextAnswerDate: new Date('2023-10-01'),
          category: Category.FIRST,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      const specificDate = new Date('2023-10-01');
      cardRepository.getCardForQuizz.mockResolvedValue(mockCards);

      const result = await learningService.getTodayQuizz(specificDate);

      expect(cardRepository.getCardForQuizz).toHaveBeenCalledWith({ date: specificDate });
      expect(result).toEqual(mockCards);
    });
  });

  describe('answerCard', () => {
    it('should call succeedToAnswerCard when isValid is true', async () => {
      const mockCard: CardDAO = {
        id: '1', question: 'What is 2+2?', answer: '4', tag: 'math',
        lastAnswerDate: new Date(),
        nextAnswerDate: new Date(),
        category: Category.FIRST,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const data = { isValid: true, cardId: '1' };
      cardRepository.updateCard.mockResolvedValue(mockCard);
    
      const result = await learningService.answerCard(data);
    
      expect(cardRepository.updateCard).toHaveBeenCalledTimes(1);
      expect(cardRepository.updateCard).toHaveBeenCalledWith({ id: '1', category: CardUpdateAction.INCREMENT });
      expect(result).toEqual(mockCard); 
    });

    it('should call failToAnswerCard when isValid is false', async () => {
      const mockCard: CardDAO = {
        id: '1',
        question: 'What is 2+2?',
        answer: '4',
        tag: 'math',
        lastAnswerDate: new Date(),
        nextAnswerDate: new Date(),
        category: Category.FIRST,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const data = { isValid: false, cardId: '1' };
      cardRepository.updateCard.mockResolvedValue(mockCard);
    
      const result = await learningService.answerCard(data);
    
      expect(cardRepository.updateCard).toHaveBeenCalledTimes(1);
      expect(cardRepository.updateCard).toHaveBeenCalledWith({ id: '1', category: CardUpdateAction.RESET });
      expect(result).toEqual(mockCard); 
    });
  });
});