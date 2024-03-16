require("dotenv").config();
import express from "express";
import config from "config";
import { connectToDb } from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const app = express();

app.use(express.json());

app.use(deserializeUser);

const port = config.get("port");

app.use(router);

app.listen(port, () => {
  log.info(`Application started on http://localhost:${port}`);
  connectToDb();
});
