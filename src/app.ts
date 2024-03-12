require("dotenv").config();
import express from "express";
import config from "config";

const app = express();

const port = config.get("port");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Application started on http://localhost:${port}`);
});
