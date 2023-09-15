const express = require("express");
const Blockchain = require("./blockchain");

const app = express();
const blockchain = new Blockchain();

app.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

app.get("/mine-block", (req, res) => {
  const block = blockchain.mineBlock();
  return res.status(200).json({
    message: "Congratulations, you just mined a block",
    block,
  });
});

app.get("/get-chain", (req, res) => {
  return res.status(200).json({
    chain: blockchain.chain,
    length: blockchain.chain.length,
  });
});

app.get("/is-chain-valid", (req, res) => {
  const isValid = blockchain.isChainValid();
  if (!isValid)
    return res.status(200).json({
      message: "Neyooooo, it's invalid bro.",
    });
  return res.status(200).json({
    message: "Yoo, it is valid",
  });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
