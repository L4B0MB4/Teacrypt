import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';

import { ApiRouter } from './api/route';

dotenv.config({ path: path.resolve(path.join(process.cwd(), "/config/"), ".env") });
mongoose.connect(process.env.MONGODB_SRV, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected");
  const port = 3000;

  const app = express();

  app.use(express.json());

  app.use("/api", ApiRouter);

  app.get("/", (_: express.Request, res: express.Response) => {
    return res.send("Welcome to Teacrypt");
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
