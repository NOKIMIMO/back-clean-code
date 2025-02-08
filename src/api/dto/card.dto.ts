import { CardUpdateAction } from "../../domain/enum/card-update.enum"
import { Category } from "../../domain/type/category.type"

export interface CreateCardRequest {
    question: string
    answer: string
    tag: string
}

export interface ListCardRequest {
    tag?: string[]
}

export interface CardResponse {
    id: string
    category: Category
    nextAnswerDate: Date
    lastAnswerDate: Date
    question: string
    answer: string
    tag: string
}

export interface UpdateCard {
    id: string
    category: CardUpdateAction
}