import {CardService} from '../../../src/domain/service/card.service'

//npm run test -- --watchAll

describe("Creation Cards", () => {
  it.each([[]])("", () => {
    CardService.createCard()
  });
});

