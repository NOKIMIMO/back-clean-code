import { CreateCardRequest, ListCardRequest } from "../../api/dto/card.dto";
import { Card } from "../type/card.type";
import { CardRepository } from "../../infrastructure/repository/card.repository";


export class CardService {
    constructor(private cardRepository: CardRepository) {}

    async getAllCards(request:ListCardRequest): Promise<Card[]> {
        return await this.cardRepository.listCards(request);

    }

    async createCard(card: CreateCardRequest): Promise<Card> {
        return await this.cardRepository.createCard(card);
    }

}
