import express from "express";
import { routes } from "./api/routes/routes";

const main = async () => {
  const app = express();
  const port = 3000;

  try {

    app.use(express.json());

    routes(app);

    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting the application:", error);
    process.exit(1);
  }
};

main();
