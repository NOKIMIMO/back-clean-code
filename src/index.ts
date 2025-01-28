import express from "express";
import { routes } from "./api/routes/routes";
import { database } from "./infrastructure/database";
 
const customLogger = (req :express.Request, res : express.Response, next: express.NextFunction) => {
  console.log("[LOGGER] - ", req.method, req.url);

  res.on("finish", () => {
      if (res.statusCode >= 400) {
        console.log("[LOGGER] - ", req.method, req.url , ' - ', res.statusCode);
        return;
      }
      console.log("[LOGGER] - ", req.method, req.url , ' - ', res.statusCode);
  });

  next();
};


const main = async () => {
  const app = express();
  const port = 3000;

  try {

    await database.initialize();

    app.use(express.json());
    app.use(customLogger);

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
