import { DataSource } from "typeorm";
import { CardDAO } from "../dao/card.dao";
import { CreateCardRequest, ListCardRequest, UpdateCard } from "../../api/dto/card.dto";
import { GetQuizzOfDateRequest } from "../../api/dto/learning.dto";
import { Category } from "../../domain/type/category.type";
import { CardNotFoundError } from "../../common/errors/card-not-found-error.error";
import { injectable, inject } from "inversify";
import { CardUpdateAction } from "../../domain/enum/card-update.enum";

@injectable()
export class CardRepository{
    constructor(@inject(DataSource) private readonly db: DataSource) {}

    async listCards(filter:ListCardRequest): Promise<CardDAO[]> {
        const query = this.db.createQueryBuilder(CardDAO,"cards")
        .select([
            '*'
        ])
        if(filter.tag){
            query.where("cards.tag = :tag", { tag: filter.tag })

        }
        return await query.getRawMany()
    }

    async getCardById(id: string): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        return await CardRepository.findOneByOrFail({id: id})
    }

    async updateCard(card: UpdateCard): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        const cardToUpdate = await CardRepository.findOneBy({id: card.id})
        if (!cardToUpdate) {
            throw new CardNotFoundError("No card found")
        }
        if (card.category === CardUpdateAction.INCREMENT) {
            cardToUpdate.category = cardToUpdate.category + 1
        }
        if (card.category === CardUpdateAction.RESET) {
            cardToUpdate.category = Category.FIRST
        }
        return await CardRepository.save(cardToUpdate)
    }

    async getRandCard(getQuizzOfDateRequest: GetQuizzOfDateRequest): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        const query = CardRepository.createQueryBuilder("cards")
        if (getQuizzOfDateRequest.date) {
            query.where("cards.createdAt >= :date", { date: getQuizzOfDateRequest.date })
        }
        const card = await query
        .orderBy("RANDOM()")
        .getOne();
        if (!card) {
            throw new Error("No card found");
        }
        return card;
    }

    async createCard(cardData: CreateCardRequest): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        const newCard = CardRepository.create({...cardData, category: Category.FIRST})
        return await CardRepository.save(newCard)
    }
}