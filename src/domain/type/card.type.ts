import { CardId } from "./cardId.type";
import { Category } from "./category.type";

export type Card = {
  id: CardId;
  category: Category;
  question: string;
  answer: string;
  tag?: string;
};
