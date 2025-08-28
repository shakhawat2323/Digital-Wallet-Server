// import { Router } from "express";
// import { WalletControllers } from "./wallet.controller";

// import { Role } from "../user/user.interface";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { validateRequest } from "../../middlewares/validateRequest";
// import { createWalletSchema } from "./wallet.validation";

// const router = Router();

// router.post(
//   "/cratewallet",
//   //   validateRequest(createWalletSchema),
//   checkAuth(Role.USER),
//   WalletControllers.createWallet
// );
// router.get("/me", checkAuth(Role.USER), WalletControllers.getMyWallet);
// router.post("/deposit", checkAuth(Role.USER), WalletControllers.depositMoney);
// router.post("/withdraw", checkAuth(Role.USER), WalletControllers.withdrawMoney);

// export const WalletRoutes = router;
import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createWalletSchema,
  depositSchema,
  withdrawSchema,
} from "./wallet.validation";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.USER),
  validateRequest(createWalletSchema),
  WalletControllers.createWallet
);
router.get(
  "/me",
  checkAuth(Role.USER), //
  WalletControllers.getMyWallet
);

router.post(
  "/add-money",
  checkAuth(Role.USER),
  validateRequest(depositSchema),
  WalletControllers.depositMoney
);

router.post(
  "/withdraw",
  checkAuth(Role.USER),
  validateRequest(withdrawSchema),
  WalletControllers.withdrawMoney
);
router.post("/send-money", checkAuth(Role.USER), WalletControllers.sendMoney);

router.get(
  "/transactions/me",
  checkAuth(Role.USER),
  WalletControllers.getMyTransactions
);

export const WalletRoutes = router;
