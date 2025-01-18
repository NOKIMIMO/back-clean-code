import express, { Request, Response } from "express";

export const routes = (app: express.Express) => {
  const BASE_URL = "/api/v1/";

  //app.use('/api/v1/admins')
  app.use(BASE_URL + "cards", require("./card.route"));
};
