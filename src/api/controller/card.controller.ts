import { Card } from "../../domain/type/card.type";
import { Request, Response } from "express";
import { database } from "../../infrastructure/database";
import { Repository } from "typeorm";
import { CardService } from "../../domain/service/card.service";
import { CreateCardRequest } from "../dto/card.dto";



export const getAllCards = async (
  req: Request,
  res: Response,
): Promise<void> => {
  
};


export const createCardRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try{
    const card: CreateCardRequest = req.body;
    const createdCard = await CardService.createCard(card);
    res.status(201).json(createdCard);
  }catch(error){
    console.error(error);
    res.status(400).json({ error: "Bad request" });
  }
};
