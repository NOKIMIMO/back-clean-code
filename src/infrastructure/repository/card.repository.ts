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
        cardToUpdate.lastAnswerDate = new Date()
        if (card.category === CardUpdateAction.INCREMENT) {
            cardToUpdate.category = cardToUpdate.category + 1
            // leitner system
            const addedDays = Math.pow(2, cardToUpdate.category)
            cardToUpdate.nextAnswerDate = new Date()
            cardToUpdate.nextAnswerDate.setDate(cardToUpdate.nextAnswerDate.getDate() + addedDays)
        }
        if (card.category === CardUpdateAction.RESET) {
            cardToUpdate.category = Category.FIRST
            cardToUpdate.nextAnswerDate = new Date()
            cardToUpdate.nextAnswerDate.setDate(cardToUpdate.nextAnswerDate.getDate() + 1)
        }
        return await CardRepository.save(cardToUpdate)
    }

    async getCardForQuizz(getQuizzOfDateRequest: GetQuizzOfDateRequest): Promise<CardDAO[]> {
        const CardRepository = this.db.getRepository(CardDAO)
        const query = CardRepository.createQueryBuilder("cards")
            .where("cards.category != :category", { category: Category.DONE });

        let dateMin: Date;
        let dateMax: Date;

        if (getQuizzOfDateRequest.date) {
            dateMin = new Date(getQuizzOfDateRequest.date);
            dateMin.setHours(0, 0, 0, 0);

            dateMax = new Date(getQuizzOfDateRequest.date);
            dateMax.setDate(dateMax.getDate() + 1);
            dateMax.setHours(0, 0, 0, 0);
        } else {
            dateMin = new Date();
            dateMin.setHours(0, 0, 0, 0);

            dateMax = new Date();
            dateMax.setDate(dateMax.getDate() + 1);
            dateMax.setHours(0, 0, 0, 0);
        }

        query.andWhere("cards.nextAnswerDate <= :dateMax", { dateMax })
            .andWhere("cards.nextAnswerDate >= :dateMin", { dateMin });
        const card = await query
        .orderBy("cards.createdAt", "ASC")
        .getMany();
        if (!card) {
            throw new Error("No card found");
        }
        return card;

    }

    async createCard(cardData: CreateCardRequest): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        const nextAnswerDate = new Date();
        nextAnswerDate.setDate(nextAnswerDate.getDate() + 1);
        const newCard = CardRepository.create({...cardData, category: Category.FIRST, nextAnswerDate: nextAnswerDate})
        return await CardRepository.save(newCard)
    }
}