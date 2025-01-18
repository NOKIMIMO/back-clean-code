import {LearningService} from '../../../src/domain/service/learning.service'

describe("Answer", () => {
    it.each([[]])("", () => {
        LearningService.answerCard()
    });
  });
  
describe("get quizz", () => {
    it.each([[]])("", () => {
        LearningService.getTodayQuizz()
    });
});