export interface GetQuizzOfDateRequest {
    date?: Date
}

export interface AnswerQuizzRequest {
    isValid: boolean
    cardId: string
}
