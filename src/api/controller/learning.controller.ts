import { Request, Response } from "express";
import { LearningService } from "../../domain/service/learning.service";
import { CardNotFoundError } from "../../common/errors/card-not-found-error.error";
import { inject, injectable } from "inversify";
import { CardResponse } from "../dto/card.dto";

@injectable()
export class LearningController {
  constructor(@inject(LearningService) private learningService: LearningService) {}

  async getTodayQuizz (
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();

      const card = await this.learningService.getTodayQuizz(date);
      const cardResponse: CardResponse[] = card.map((card) => {
        return { ...card, tag: card.tag || "" };
      });
      res.status(200).json(cardResponse);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Bad request" });
    }
  };

  async answerCard(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const cards = await this.learningService.answerCard({isValid: req.body.isValid, cardId: req.params.cardId});
      res.status(200).json(cards);
    } catch(error){
      if(error instanceof CardNotFoundError){
        console.error(error);
        res.status(400).json({ error: "Card not found" });
      }else{                   ///////////////////////////////////////////////////////////TODO! add error from middleware
        console.error(error);
        res.status(400).json({ error: "Bad request" });
      }
    }
  };
}