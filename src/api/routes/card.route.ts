import { Router } from "express"; // Importation du routeur d'Express
import { createCards, getAllCards } from "../controller/card.controller";
import { getTodayQuizz, answerCard } from "../controller/learning.controller";

const router = Router(); // Création du routeur

router.get("/", getAllCards);

router.post("/", createCards);

router.get("/quizz", getTodayQuizz);

router.patch("/:idCard/answer", answerCard);

export default router; // Exportation du routeur
