import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.UpdateUser
);
export const UserRoutes = router;
