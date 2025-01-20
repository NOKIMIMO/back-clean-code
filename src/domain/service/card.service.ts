import { CreateCardRequest } from "../../api/dto/card.dto";
import { Card } from "../type/card.type";


export class CardService {
    constructor() {}

    static getAllCards(): Card[] {
        // TODO : get all cards
        // Return type : Card[]
    }

    static createCard(card: CreateCardRequest): Card {
        // TODO : create card 
        // Return type : Card

    }

}
