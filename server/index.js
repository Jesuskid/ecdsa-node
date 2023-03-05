const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "04860c4f454ff7c6dee938b38af4d9955741476f4f18c2bc77dca86318817f3470533be76b060ee2dbc277bb9d7636944ae8604b5aa5612b334f0306273ba7805a": 100,
  "04047d3159d297c4b8d820f98532e85f392dc4992c4deeff764fdb6eee90a3c32f576b7ec933b5d344da94d8de5f34c2c9a291b2ef5d54285e9e284f21f3b088dc": 50,
  "0469d69cc6686fbc194ccd374d9b5e5ab5a25a0c92922f9356580d40b93cf194a040257c7c3e21356811876aca3fdc890cebf2c498bc40dfaccf35a558a8db0260": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //get signature

  //get client from side
  const { sender, signature, hash, recipient, amount } = req.body;
  const [sign, recoveryBut] = signature
  const verifySigner = secp.verify(sign, hash, sender)
  console.log(typeof signature)
  const pKey = secp.recoverPublicKey(hash, sign, recoveryBut)
  console.log(verifySigner)

  setInitialBalance(sender);
  setInitialBalance(recipient);


  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
