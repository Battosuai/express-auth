require("dotenv").config();
import express from "express";
import config from "config";
import { connectToDb } from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import swaggerDocs from "./utils/swagger";

const app = express();

app.use(express.json());

app.use(deserializeUser);

const port = config.get("port") as number;

app.use(router);

app.listen(port, () => {
  log.info(`Application started on http://localhost:${port}`);
  connectToDb();

  swaggerDocs(app, port);
});
