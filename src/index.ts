import { startServer } from "./server";
import db from "./entity";

const startUp = async () => {
  try {
    await db.sequelize.sync();
    startServer();
  } catch (error) {
    console.error((error as Error).message);
  }
};

startUp();
