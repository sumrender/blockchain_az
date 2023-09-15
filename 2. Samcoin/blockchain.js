const axios = require("axios");
const crypto = require("crypto");

class Blockchain {
  constructor(receiver) {
    this.receiver = receiver;
    this.chain = [];
    this.transactions = [];
    this.create_block(1, "0");
    this.nodes = []; // nodes should be a set
  }

  getDateTime() {
    const currentDate = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
      hour12: false,
    };
    const ISTDateTime = currentDate.toLocaleString("en-IN", options);
    return ISTDateTime;
  }

  create_block(proof, previousHash) {
    let block = {
      index: this.chain.length + 1,
      timestamp: this.getDateTime(),
      proof,
      previousHash,
      transactions: this.transactions,
    };
    this.transactions = [];
    this.chain.push(block);
    return block;
  }

  getPreviousBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(previousProof) {
    let newProof = 1;
    let checkProof = false;
    while (!checkProof) {
      const dataToHash = newProof ** 2 - previousProof ** 2;
      const hashOperation = crypto
        .createHash("sha256")
        .update(String(dataToHash))
        .digest("hex");
      const starting4 = hashOperation.substring(0, 4);
      if (starting4 === "0000") checkProof = true;
      else newProof++;
    }
    return newProof;
  }

  hash(block) {
    const blockStr = JSON.stringify(block);
    return crypto.createHash("sha256").update(blockStr).digest("hex");
  }

  mineBlock(nodeAddress) {
    const previousBlock = this.getPreviousBlock();
    const previousProof = previousBlock.proof;
    const proof = this.proofOfWork(previousProof);
    const previousHash = this.hash(previousBlock);
    this.addTransaction(nodeAddress, this.receiver, 1);
    const block = this.create_block(proof, previousHash);

    return block;
  }

  isChainValid(chain) {
    if (!chain) {
      chain = this.chain;
      console.log("checking self chain only");
    }
    console.log("start is chain valid check");
    let previousBlock = chain[0];
    let blockIndex = 1;
    while (blockIndex < chain.length) {
      console.log(`blockIndex: ${blockIndex}`);

      const block = chain[blockIndex];

      // check previous hash
      if (block.previousHash != this.hash(previousBlock)) {
        console.log("prev hash do not match");
        return false;
      }
      // check proof
      const dataToHash = block.proof ** 2 - previousBlock.proof ** 2;
      const hashOperation = crypto
        .createHash("sha256")
        .update(String(dataToHash))
        .digest("hex");
      const starting4 = hashOperation.substring(0, 4);
      if (starting4 !== "0000") {
        console.log("starting 4 is wrong", hashOperation);
        return false;
      }

      previousBlock = block;
      blockIndex++;
    }
    return true;
  }

  addTransaction(sender, receiver, amount) {
    this.transactions.push({
      sender,
      receiver,
      amount,
    });
    const previousBlock = this.getPreviousBlock();
    return previousBlock.index + 1;
  }

  addNode(url) {
    const parsedUrl = new URL(url);
    const { protocol, hostname, port } = parsedUrl;
    if (!protocol || !hostname || !port) return false;
    this.nodes.push(`${protocol}//${hostname}:${port}`);
    return true;
  }

  async replaceChain() {
    try {
      const network = this.nodes;
      let longestChain;
      let maxLength = this.chain.length;
      for (let node of network) {
        let { data } = await axios.get(`${node}/get-chain`);
        if (data) {
          const length = data.length;
          const chain = data.chain;
          if (length > maxLength && this.isChainValid(chain)) {
            maxLength = length;
            longestChain = chain;
          }
        }
      }
      if (longestChain) {
        this.chain = longestChain;
        return true;
      }
      return false;
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = Blockchain;
