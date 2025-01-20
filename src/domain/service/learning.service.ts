import { Card } from "../type/card.type";

export class LearningService {

    constructor() {}

    static getTodayQuizz(date: Date): Card[] {
        const cards: Card[] = [];
        return cards;
    }

    static answerCard(id: String, isValid: object): Object {
        // Une fonction qui transforme le bool en requestBody
        //TODO
    }
} 