import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';

import { ApiRouter } from './api/route';

// the types are wrong for the express-validator
const { query } = require("express-validator");

dotenv.config({ path: path.resolve(path.join(process.cwd(), "/config/"), ".env") });

const port = 3000;

const app = express();

app.use(express.json());

app.use("/api", ApiRouter);

app.get("/", (req: express.Request, res: express.Response) => {
  return res.send("Welcome to Teacrypt");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
