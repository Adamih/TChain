import * as crypto from "crypto";

type PublicKey = string;
type PrivateKey = string;

type Account = string;

enum EntryType {
  DEBIT,
  CREDIT,
}

type Entry = {
  account: Account;
  type: EntryType;
  amount: number;
};

type ReportData = {
  accounts: Account[];
  entries: Entry[];
};

class Report {
  constructor(public data: ReportData | null, public owner: PublicKey) {}

  toString() {
    return JSON.stringify(this);
  }
}

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
class Chain {
  public static instance = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [
      // Genesis block
      new Block("", new Report(null, "genesis")),
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

class Person {
  public publicKey: PublicKey;
  public privateKey: PrivateKey;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.publicKey = keypair.publicKey;
    this.privateKey = keypair.privateKey;
  }

  createReport(data: ReportData) {
    const report = new Report(data, this.publicKey);

    const sign = crypto.createSign("SHA256");
    sign.update(report.toString()).end();

    const signature = sign.sign(this.privateKey);
    Chain.instance.addBlock(report, signature);
  }
}

// Example usage

const satoshi = new Person();
const bob = new Person();

satoshi.createReport({
  accounts: ["Food", "Work"],
  entries: [
    { account: "Food", type: EntryType.CREDIT, amount: 100 },
    { account: "Work", type: EntryType.DEBIT, amount: 100 },
  ],
});

bob.createReport({
  accounts: ["Food", "Work"],
  entries: [
    { account: "Food", type: EntryType.CREDIT, amount: 20 },
    { account: "Work", type: EntryType.DEBIT, amount: 30 },
  ],
});

console.log(Chain.instance);
console.log(Chain.instance.lastBlock);
