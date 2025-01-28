import "reflect-metadata";
import { Container } from "inversify";
import { CardController } from "./api/controller/card.controller";
import { CardService } from "./domain/service/card.service";
import { CardRepository } from "./infrastructure/repository/card.repository";
import { DataSource } from "typeorm";
import database from "./infrastructure/database";
import { LearningService } from "./domain/service/learning.service";
import { LearningController } from "./api/controller/learning.controller";

const container = new Container();

container.bind<CardController>(CardController).toSelf().inSingletonScope();
container.bind<CardService>(CardService).toSelf().inSingletonScope();
container.bind<CardRepository>(CardRepository).toSelf().inSingletonScope();
container.bind<LearningService>(LearningService).toSelf().inSingletonScope();
container.bind<LearningController>(LearningController).toSelf().inSingletonScope();
container.bind<DataSource>(DataSource).toConstantValue(database);

export { container };
