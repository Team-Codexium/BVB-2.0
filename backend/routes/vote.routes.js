import {Router} from "express";
const router=Router();

import { addVote } from "../controllers/voting.controller.js";
import { verifyRapperJWT } from "../middlewares/JWTAuth.middleware.js";
router.route("/add").post(verifyRapperJWT,addVote);
export default router