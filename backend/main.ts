import * as express from 'express';
import * as NodeRSA from 'node-rsa';

// the types are wrong for the express-validator
const { query, validationResult } = require("express-validator");
const port = 3000;
const key = new NodeRSA({ b: 2064 });

const text = "Hello RSA!";
const encrypted = key.encrypt(text, "base64");
console.log("encrypted: ", encrypted);
const decrypted = key.decrypt(encrypted, "utf8");
console.log("decrypted: ", decrypted);

console.log(key.exportKey("public"));

const app = express();

app.use(express.json());

const validate = (validations: Array<any>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

app.get("/", validate([query("username").notEmpty().isString()]), (req: express.Request, res: express.Response) => {
  return res.json({ username: req.query.username });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
