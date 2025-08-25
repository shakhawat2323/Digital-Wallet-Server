// import { Router } from "express";

// import { AuthServices } from "./auth.service";

// const router = Router();

// router.post("/login", AuthServices.credentialsLogin);

// export const AuthRoutes = router;
import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

export const AuthRoutes = router;
