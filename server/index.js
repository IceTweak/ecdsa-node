const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const crypto = require("./crypto");

app.use(cors());
app.use(express.json());

const balances = new Map();

app.post('/deposit', (req, res) => {
  const { account, balance } = req.body;
  balances.set(account, balance);
});


app.get("/balance/:account", (req, res) => {
  const { account } = req.params;
  const balance = balances.get(account) || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  // Retrive public key from signature
  const publicKey = crypto.signatureToPublicKey(message, signature);
  console.log(publicKey);
  const sender = crypto.publicKeyToAccount(publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances.get(sender) < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances.set(sender, balances.get(sender) - amount);
    balances.set(recipient, balances.get(recipient) + amount);
    res.send({ balance: balances.get(sender) });
  }
});

app.listen(port, () => {
  console.log(`\nListening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
