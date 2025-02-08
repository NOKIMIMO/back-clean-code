import { inject, injectable } from "inversify";
import { UpdateCard } from "../../api/dto/card.dto";
import { AnswerQuizzRequest } from "../../api/dto/learning.dto";
import { CardRepository } from "../../infrastructure/repository/card.repository";
import { CardUpdateAction } from "../enum/card-update.enum";
import { Card } from "../type/card.type";

@injectable()
export class LearningService {

    constructor(@inject(CardRepository) private cardRepository: CardRepository) {}

    async getTodayQuizz(date?: Date): Promise<Card> {
        if(!date){
            date = new Date();
        }
        return await this.cardRepository.getCardForQuizz({date: date});


    }

    async answerCard(data: AnswerQuizzRequest): Promise<Card> {
        if(data.isValid){
            return this.succeedToAnswerCard(data.cardId);
        }else{
            return this.failToAnswerCard(data.cardId);
        }
    }

    private async failToAnswerCard(cardId: string): Promise<Card> {
        const updatedCard: UpdateCard = {id: cardId, category: CardUpdateAction.RESET};
        return await this.cardRepository.updateCard(updatedCard)
    }

    private async succeedToAnswerCard(cardId: string): Promise<Card> {
        
        const updatedCard: UpdateCard = {id: cardId, category: CardUpdateAction.INCREMENT};
        return await this.cardRepository.updateCard(updatedCard);
    }
} 