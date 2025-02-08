import { Request, Response } from "express";
import { CardService } from "../../domain/service/card.service";
import { injectable, inject } from "inversify";

@injectable()
export class CardController {
  constructor(@inject(CardService) private cardService: CardService) {}

  async getAllCards(req: Request, res: Response): Promise<void> {
    try {
      const cards = await this.cardService.getAllCards(req.query);
      res.status(200).json(cards);
    } catch (error) {
      res.status(400).json({ error: "Bad request" });
    }
  }

  async createCardRequest(req: Request, res: Response): Promise<void> {
    try {
      const createdCard = await this.cardService.createCard(req.body);
      res.status(201).json(createdCard);
    } catch (error) {
      res.status(400).json({ error: "Bad request" });
    }
  }
}