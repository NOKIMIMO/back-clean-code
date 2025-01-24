import { DataSource } from "typeorm";
import { CardDAO } from "../dao/card.dao";
import { CreateCardRequest, ListCardRequest } from "../../api/dto/card.dto";


export class CardRepository{
    constructor(private readonly db:DataSource) {}

    async listCards(filter:ListCardRequest): Promise<CardDAO[]> {
        const query = this.db.createQueryBuilder(CardDAO,"cards")
        .select([
            '*'
        ])
        if(filter.tag){
            query.where("cards.tag IN (:...tag)",{tag:filter.tag})
        }
        return await query.getRawMany()
    }

    async createCard(cardData: CreateCardRequest): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        const newCard = CardRepository.create({...cardData})
        return await CardRepository.save(newCard)
    }
}