/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AgentServices } from "./agent.service";

const cashIn = async (req: Request, res: Response) => {
  try {
    const { userWalletId, amount } = req.body;
    const agentWalletId = req.user.wallet; // from auth middleware
    const result = await AgentServices.cashIn(
      agentWalletId,
      userWalletId,
      amount
    );
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const cashOut = async (req: Request, res: Response) => {
  try {
    const { userWalletId, amount } = req.body;
    const agentWalletId = req.user.wallet;
    const result = await AgentServices.cashOut(
      agentWalletId,
      userWalletId,
      amount
    );
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getCommissions = async (req: Request, res: Response) => {
  try {
    const agentWalletId = req.user.wallet;
    const result = await AgentServices.getCommissions(agentWalletId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyTransactions = async (req: Request, res: Response) => {
  try {
    const walletId = req.user.wallet;
    const result = await AgentServices.getMyTransactions(walletId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const AgentControllers = {
  cashIn,
  cashOut,
  getCommissions,
  getMyTransactions,
};
