export interface getQuizzOfDateRequest {
    date?: Date
}

export interface answerQuizzRequest {
    isValid: boolean
    cardId: string
}
