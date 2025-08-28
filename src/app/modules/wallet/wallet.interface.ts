import { Types } from "mongoose";

/** Wallet Types */
export enum WalletType {
  PERSONAL = "PERSONAL",
  BUSINESS = "BUSINESS",
}
export enum Status {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
// Wallet Interface
export interface IWallet {
  user: string; // কোন user এর wallet
  balance: number; // wallet এর টাকা
  status: "ACTIVE" | "BLOCKED"; // wallet status
}
export enum Currency {
  USD = "USD",
  BDT = "BDT",
  EUR = "EUR",
  INR = "INR",
}

/** Wallet Schema */
export interface IWallet {
  _id?: Types.ObjectId;
  user: string;
  balance: number;
  currency: Currency; // e.g. "USD", "BDT"
  type: WalletType;
  isActive?: boolean;
}
