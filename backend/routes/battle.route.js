import { Router } from "express";
import { verifyRapperJWT } from "../middlewares/JWTAuth.middleware.js";
import { acceptBattle, createBattle, getAllBattles, getBattleById, getBattleByRapperId, getBattleByStatus } from "../controllers/battle.controller.js";

const router = Router();

router.route("/create-battle").post(verifyRapperJWT,createBattle);
router.route("/accept-battle/:battleId").put(verifyRapperJWT,acceptBattle);
router.route("/get-battle-by-id/:battleId").get(verifyRapperJWT,getBattleById);
router.route("/get-battle-by-rapper-id/:rapperId").get(verifyRapperJWT,getBattleByRapperId);
router.route("/get-all-battles").get(getAllBattles);
router.route("/get-battle-by-status/:status").get(getBattleByStatus);

export default router