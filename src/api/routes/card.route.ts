import { Router } from "express";
import { createCardRequest, getAllCards } from "../controller/card.controller";
import { getTodayQuizz, answerCard } from "../controller/learning.controller";
import { validatorMiddleware } from "../middleware/body-validator.middleware";
import { createCardBodyValidator } from "../validators/card.validator"
import { answerQuizzBodyValidator, answerQuizzParamValidator, getQuizzOfDateQuerryValidator } from "../validators/learning.validator";
const router = Router(); 

router.get("/", getAllCards);

router.post("/",validatorMiddleware({body: createCardBodyValidator}),createCardRequest);

router.get("/quizz", validatorMiddleware({query: getQuizzOfDateQuerryValidator}), getTodayQuizz);

router.patch("/:idCard/answer", validatorMiddleware({params: answerQuizzBodyValidator, body: answerQuizzParamValidator}), answerCard);

export default router; 
