export type Report = {
  data: ReportData | null;
  owner: PublicKey;
};

export type RSAKeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};

export type PublicKey = string;
export type PrivateKey = string;

export type Account = string;

export enum EntryType {
  DEBIT,
  CREDIT,
}

export type Entry = {
  account: Account;
  type: EntryType;
  amount: number;
};

export type ReportData = {
  accounts: Account[];
  entries: Entry[];
};
