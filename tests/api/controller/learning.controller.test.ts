import { app } from "../../../src";
import { answerQuizzRequest } from "../../../src/api/dto/learning.dto";
import request from "supertest";

const mockLearningService = {
  getTodayQuizz: jest.fn(),
  answerCard: jest.fn(),
};

jest.mock("../../../src/domain/service/learning.service", () => {
  return {
    LearningService: jest.fn().mockImplementation(() => mockLearningService),
  };
});

describe("answerCard", () => {
  const validAndRightAnswerData: answerQuizzRequest = {
    cardId: "1",
    isValid: true,
  };
  const validButWrongAnswerData: answerQuizzRequest = {
    cardId: "1",
    isValid: false,
  };

  const invalidAnswerMissingData: any = {
    answer: false,
  };
  const invalidAnswerDataType: any = {
    cardId: "1",
    answer: 9,
  };

  it("should answer a quizz successfully and return 200 status", async () => {
    const mockedResult = true; // Mock the boolean response
    mockLearningService.answerCard.mockResolvedValue(mockedResult);

    const response = await request(app)
      .post("/quizz")
      .send(validAndRightAnswerData)
      .expect(200);

    expect(mockLearningService.answerCard).toHaveBeenCalledWith(
      validAndRightAnswerData.cardId,
      validAndRightAnswerData.isValid
    );
    expect(response.body).toEqual({ success: true });
    expect(response.status).toBe(200);
  });

  it("should return 400 status because of missing parameter", async () => {
    const response = await request(app)
      .post("/quizz")
      .send(invalidAnswerMissingData)
      .expect(400);

    expect(mockLearningService.answerCard).not.toHaveBeenCalled();
    expect(response.body.error).toBe("Missing property cardId");
    expect(response.status).toBe(400);
  });

  it("should return 400 status because of wrong parameter type", async () => {
    const response = await request(app)
      .post("/quizz")
      .send(invalidAnswerDataType)
      .expect(400);

    expect(mockLearningService.answerCard).not.toHaveBeenCalled();
    expect(response.body.error).toBe('"answer" must be a boolean');
    expect(response.status).toBe(400);
  });
});
