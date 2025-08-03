import {Router} from "express";
const router=Router();

import { addVote, checkVote } from "../controllers/voting.controller.js";
import { verifyRapperJWT } from "../middlewares/JWTAuth.middleware.js";
router.route("/update/:battleId").post(verifyRapperJWT,addVote);

router.route("/check/:battleId").get(verifyRapperJWT, checkVote);
export default router