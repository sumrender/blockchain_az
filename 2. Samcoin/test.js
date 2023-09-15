const express = require("express");
const { v4: uuid } = require("uuid");
const Blockchain = require("./blockchain");

const app = express();
const nodeAddress = uuid().replace("-", "");
const blockchain = new Blockchain("Tammy");

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

app.get("/mine-block", (req, res) => {
  const block = blockchain.mineBlock(nodeAddress);
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

app.post("/add-transaction", (req, res) => {
  const { sender, receiver, amount } = req.body;
  if (!sender || !receiver || !amount)
    return res
      .status(401)
      .json({ message: "sender, receiver and amount fields are required" });
  let index = blockchain.addTransaction(sender, receiver, amount);
  return res
    .status(201)
    .json({ message: `This transaction will be added to Block ${index}` });
});

app.post("/connect-node", (req, res) => {
  const { nodes } = req.body;
  if (!nodes)
    return res
      .status(401)
      .json({ message: "array of nodes to be connected required" });
  for (let node of nodes) {
    blockchain.addNode(node);
  }

  return res.status(201).json({
    message: "All nodes have been included",
    totalNodes: blockchain.nodes,
  });
});

app.get("/replace-chain", async (req, res) => {
  const isChainReplaced = await blockchain.replaceChain();
  if (isChainReplaced)
    return res.status(200).json({
      message:
        "The nodes had diff chains, so it was replaced by the longest one.",
      chain: blockchain.chain,
    });

  return res.status(200).json({
    message: "All good, this chain is the longest one",
    chain: blockchain.chain,
  });
});

app.listen(3001, () => {
  console.log("server listening on port 3001");
});
