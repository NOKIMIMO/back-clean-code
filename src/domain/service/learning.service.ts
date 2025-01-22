import { Card } from "../type/card.type";

export class LearningService {

    constructor() {}

    async getTodayQuizz(date: Date): Promise<Card[]> {
        const cards: Card[] = [];
        return cards;
    }

    async answerCard(id: String, isValid: object): Promise<boolean> {
        // Une fonction qui transforme le bool en requestBody
        //TODO
        return true;
    }
} 