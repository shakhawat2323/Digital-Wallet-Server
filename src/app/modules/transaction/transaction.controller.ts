// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import { TransactionServices } from "./transaction.service";
// import { WalletServices } from "../wallet/wallet.service";

// // Send Money
// const sendMoney = catchAsync(async (req: any, res: Response) => {
//   const { amount, toEmail } = req.body;

//   // Find recipient wallet
//   const recipientWallet = await WalletServices.getWalletByUserId(toEmail); // Assuming userId = email for simplicity
//   if (!recipientWallet) throw new Error("Recipient wallet not found");

//   // Deduct sender balance
//   const senderWallet = await WalletServices.updateBalance(req.user.id, -amount);

//   // Add recipient balance
//   await WalletServices.updateBalance(toEmail, amount);

//   // Log transaction
//   const transaction = await TransactionServices.createTransaction(
//     "send",
//     amount,
//     req.user.id,
//     toEmail
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Money sent successfully",
//     data: transaction,
//   });
// });

// // Get Transaction History
// const getMyTransactions = catchAsync(async (req: any, res: Response) => {
//   const transactions = await TransactionServices.getTransactionsByUser(
//     req.user.id
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Transaction history retrieved",
//     data: transactions,
//   });
// });

// export const TransactionControllers = {
//   sendMoney,
//   getMyTransactions,
// };
