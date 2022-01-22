import * as crypto from "crypto";
import { Report, ReportData, RSAKeyPair } from "./types";

export function createReport(keypair: RSAKeyPair, data: ReportData) {
  const report: Report = { data: data, owner: keypair.publicKey };

  const sign = crypto.createSign("SHA256");
  sign.update(report.toString()).end();

  const signature = sign.sign(keypair.privateKey);
  return { report, signature };
}

export function generateRSA(): RSAKeyPair {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}
