import {Router} from 'express'
import {addAudioToBattle, getAudioFromBattle} from '../controllers/media.controller.js'
import multer from 'multer';
import {verifyRapperJWT} from "../middlewares/JWTAuth.middleware.js"
const router = Router();

router.route("/:battleId/:rapperId/add-audio").post(verifyRapperJWT, multer().single('audio'), addAudioToBattle);
router.route("/:battleId/:rapperId/get-audio").get(verifyRapperJWT, getAudioFromBattle)
export default router;