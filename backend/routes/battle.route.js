import { Router } from "express";
import { verifyRapperJWT } from "../middlewares/JWTAuth.middleware.js";
import { acceptBattle, createBattle, getAllBattles, getBattleById, getBattleByRapperId, getBattleByStatus, getQueryBattle } from "../controllers/battle.controller.js";

const router = Router();

router.route("/create").post(verifyRapperJWT,createBattle);
router.route("/accept/:battleId").put(verifyRapperJWT,acceptBattle);
router.route("/:battleId").get(verifyRapperJWT,getBattleById);
router.route("/rapper/:rapperId").get(verifyRapperJWT,getBattleByRapperId);
router.route("/").get(getAllBattles);
router.route("/status/:status").get(verifyRapperJWT, getBattleByStatus);
router.route("/query").post(verifyRapperJWT, getQueryBattle)

export default router 