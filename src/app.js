const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPw = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      password: hashedPw,
    };
    users.push(user);

    res.status(201).send();
  } catch {
    res.status(500).send({
      message: "error",
    });
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);

  if (!user) return res.status(400).send({ message: "Cannot find user" });

  try {
    //req.body.password -> original password
    //user.password -> hashed password
    const pw = await bcrypt.compare(req.body.password, user.password);

    if (!pw) res.send("Not Allowed");
    else res.send("Success");
  } catch {
    res.status(500).send({
      message: "error",
    });
  }
});

app.listen(3333);
