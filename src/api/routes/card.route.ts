import { Router } from "express";
import { CardController } from "../controller/card.controller";
import { LearningController } from "../controller/learning.controller";
import { validatorMiddleware } from "../middleware/body-validator.middleware";
import { createCardBodyValidator, listCardQuerryValidator } from "../validators/card.validator"
import { answerQuizzBodyValidator, answerQuizzParamValidator, getQuizzOfDateQuerryValidator } from "../validators/learning.validator";

export function cardRoutes(
    cardController: CardController,
    learningController: LearningController
  ): Router {
    const router = Router();
  
    router.get("/", 
        validatorMiddleware({ body: listCardQuerryValidator }),
        cardController.getAllCards.bind(cardController));
  
    router.post(
      "/",
      validatorMiddleware({ body: createCardBodyValidator }),
      cardController.createCardRequest.bind(cardController)
    );
  
    router.get(
      "/quizz",
      validatorMiddleware({ query: getQuizzOfDateQuerryValidator }),
      learningController.getTodayQuizz.bind(learningController)
    );
  
    router.patch(
      "/:cardId/answer",
      validatorMiddleware({ params: answerQuizzParamValidator, body: answerQuizzBodyValidator }),
      learningController.answerCard.bind(learningController)
    );
  
    return router;
  }