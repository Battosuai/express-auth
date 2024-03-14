import mongoose from "mongoose";
import config from "config";
import log from "./logger";

async function connectToDb() {
  try {
    const dbUri = config.get<string>("dbUri");

    await mongoose.connect(dbUri);
    log.info("Connected to DB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export { connectToDb };
