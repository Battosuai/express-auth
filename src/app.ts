require("dotenv").config();
import express from "express";
import config from "config";
import { connectToDb } from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";

const app = express();

app.use(express.json());

const port = config.get("port");

app.use(router);

app.listen(port, () => {
  log.info(`Application started on http://localhost:${port}`);
  connectToDb();
});
