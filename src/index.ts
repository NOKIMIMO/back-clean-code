import express, { Request, Response } from "express";
import { routes } from "./api/routes/routes";

const app = express();

const main = async () => {
  const port = 3000;

  app.use(express.json());

  routes(app);

  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
};

export { app };

main();
