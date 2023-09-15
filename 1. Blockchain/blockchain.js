const crypto = require("crypto");

class Blockchain {
  constructor() {
    this.chain = [];
    this.create_block(1, "0");
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
    };
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

  mineBlock() {
    const previousBlock = this.getPreviousBlock();
    const previousProof = previousBlock.proof;
    const proof = this.proofOfWork(previousProof);
    const previousHash = this.hash(previousBlock);
    const block = this.create_block(proof, previousHash);

    return block;
  }

  isChainValid(chain) {
    if (!chain) {
      chain = this.chain;
      console.log("checking self chain only");
    }
    console.log("start valid check");
    if (chain.length == 1) return true;
    console.log("len > 1");
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
}

module.exports = Blockchain;
