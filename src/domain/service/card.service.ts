import { CreateCardRequest, ListCardRequest } from "../../api/dto/card.dto";
import { Card } from "../type/card.type";
import { CardRepository } from "../../infrastructure/repository/card.repository";
import { injectable, inject } from "inversify";

@injectable()
export class CardService {
  constructor(@inject(CardRepository) private cardRepository: CardRepository) {}

    async getAllCards(request:ListCardRequest): Promise<Card[]> {
        return await this.cardRepository.listCards(request);

    }

    async createCard(card: CreateCardRequest): Promise<Card> {
        return await this.cardRepository.createCard(card);
    }

    

}
