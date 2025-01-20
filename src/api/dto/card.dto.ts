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
    question: string
    answer: string
    tag: string
}