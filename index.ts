import { Chain } from "./blockchain";
import { createReport, generateRSA } from "./client";
import { EntryType } from "./types";

// Create client
const keypair = generateRSA();

// Client create and send report
const { report, signature } = createReport(keypair, {
  accounts: ["Food", "Work"],
  entries: [
    { account: "Food", type: EntryType.CREDIT, amount: 100 },
    { account: "Work", type: EntryType.DEBIT, amount: 100 },
  ],
});

// Server process signed block
Chain.instance.addBlock(report, signature);

// Verify block is added to chain
console.log(Chain.instance);
console.log(Chain.instance.lastBlock);
