import express, { Request, Response } from "express";

import { routes } from "./api/routes/routes";

const main = async () => {
  const app = express();
  const port = 3000;

  app.use(express.json());

  routes(app);

  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
};

main();
