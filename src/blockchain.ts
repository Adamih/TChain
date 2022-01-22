import * as crypto from "crypto";
import { Report } from "./types";

// Individual block on the chain
class Block {
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string,
    public report: Report,
    public ts = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    return hash.digest("hex");
  }
}

// The blockchain
export class Chain {
  public static instance = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [
      // Genesis block
      new Block("", { data: null, owner: "genesis" }),
    ];
  }

  // Most recent block
  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Proof of work system
  mine(nonce: number) {
    let solution = 1;
    console.log("⛏️ mining ...");

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substring(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  // Add a new block to the chain if valid signature & proof of work is complete
  addBlock(report: Report, signature: Buffer) {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(report.toString());

    const isValid = verifier.verify(report.owner, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, report);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }

  toString() {
    return JSON.stringify(this);
  }
}
