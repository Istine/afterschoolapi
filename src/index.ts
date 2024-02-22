import app from "./server";
import db from "./entity";
import config from "./config";

const startUp = async () => {
  const PORT = config.port || 3000;

  try {
    await db.sequelize.sync();
    app.listen(PORT, () => {
      console.info(`Server is running on localhost:${PORT}`);
    });
  } catch (error) {
    console.error((error as Error).message);
  }
};

startUp();
