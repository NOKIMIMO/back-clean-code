import { DataSource } from "typeorm";
import { CardDAO } from "../dao/card.dao";
import { CreateCardRequest, ListCardRequest, UpdateCard } from "../../api/dto/card.dto";
import { GetQuizzOfDateRequest } from "../../api/dto/learning.dto";
import { Category } from "../../domain/type/category.type";
import { CardNotFoundError } from "../../common/errors/card-not-found-error.error";
import { injectable, inject } from "inversify";
import { CardUpdateAction } from "../../domain/enum/card-update.enum";

const LEITNER_FACTOR = 2;

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

    private incrementCategory(cardToUpdate: CardDAO): CardDAO {
        cardToUpdate.category = cardToUpdate.category + 1
        const daysToAdd = Math.pow(LEITNER_FACTOR, cardToUpdate.category)
        cardToUpdate.nextAnswerDate = new Date()
        cardToUpdate.nextAnswerDate.setDate(cardToUpdate.nextAnswerDate.getDate() + daysToAdd)
        return cardToUpdate;
    }
    private resetCategory(cardToUpdate: CardDAO): CardDAO {
        cardToUpdate.category = Category.FIRST
        cardToUpdate.nextAnswerDate = new Date()
        cardToUpdate.nextAnswerDate.setDate(cardToUpdate.nextAnswerDate.getDate() + 1)
        return cardToUpdate;
    }

    private computeCardUpdate(category: CardUpdateAction, cardToUpdate: CardDAO | null): CardDAO  {
        if (!cardToUpdate) {
            throw new CardNotFoundError("No card found")
        }
        cardToUpdate.lastAnswerDate = new Date()
        if (category === CardUpdateAction.INCREMENT) {
            cardToUpdate = this.incrementCategory(cardToUpdate)
        }
        if (category === CardUpdateAction.RESET) {
            cardToUpdate = this.resetCategory(cardToUpdate)
        }
        return cardToUpdate;
    }

    async updateCard(card: UpdateCard): Promise<CardDAO> {
        const CardRepository = this.db.getRepository(CardDAO)
        let cardToUpdate = await CardRepository.findOneBy({id: card.id})
        cardToUpdate = this.computeCardUpdate(card.category, cardToUpdate);
        return await CardRepository.save(cardToUpdate)
    }

    private getMinDate(requestedDate?: Date): Date {
        let dateMin: Date;
        if(requestedDate){
            dateMin = new Date(requestedDate);
        } else {
            dateMin = new Date();
        }
        dateMin.setHours(0, 0, 0, 0);
        return dateMin;
    }

    private getMaxDate(requestedDate?: Date): Date {
        let dateMax: Date;
        if(requestedDate){
            dateMax = new Date(requestedDate.getDate() + 1);
        } else {
            dateMax = new Date();
            dateMax.setDate(dateMax.getDate() + 1);
        }
        dateMax.setHours(0, 0, 0, 0);
        return dateMax;
    }

    async getCardForQuizz(getQuizzOfDateRequest: GetQuizzOfDateRequest): Promise<CardDAO[]> {
        const CardRepository = this.db.getRepository(CardDAO)
        const query = CardRepository.createQueryBuilder("cards")
            .where("cards.category != :category", { category: Category.DONE });
        
        let dateMin: Date = this.getMinDate(getQuizzOfDateRequest.date);
        let dateMax: Date = this.getMaxDate(getQuizzOfDateRequest.date);
        
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