"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentControllers = void 0;
const agent_service_1 = require("./agent.service");
const cashIn = async (req, res) => {
    try {
        const { userWalletId, amount } = req.body;
        const agentWalletId = req.user.wallet; // from auth middleware
        const result = await agent_service_1.AgentServices.cashIn(agentWalletId, userWalletId, amount);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const cashOut = async (req, res) => {
    try {
        const { userWalletId, amount } = req.body;
        const agentWalletId = req.user.wallet;
        const result = await agent_service_1.AgentServices.cashOut(agentWalletId, userWalletId, amount);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const getCommissions = async (req, res) => {
    try {
        const agentWalletId = req.user.wallet;
        const result = await agent_service_1.AgentServices.getCommissions(agentWalletId);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const getMyTransactions = async (req, res) => {
    try {
        const walletId = req.user.wallet;
        const result = await agent_service_1.AgentServices.getMyTransactions(walletId);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.AgentControllers = {
    cashIn,
    cashOut,
    getCommissions,
    getMyTransactions,
};
