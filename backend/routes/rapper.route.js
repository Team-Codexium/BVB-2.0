import { Router } from "express";
import { currentRapper, loginRapper, logoutRapper, registerRapper } from "../controllers/auth.controller.js";
import { verifyRapperJWT } from "../middlewares/JWTAuth.middleware.js";

const router = Router();

router.route("/current-rapper").get(verifyRapperJWT, currentRapper)
router.route("/register-rapper").post(registerRapper);
router.route("/login-rapper").post(loginRapper)
router.route("/logout-rapper").post(verifyRapperJWT, logoutRapper)

export default router