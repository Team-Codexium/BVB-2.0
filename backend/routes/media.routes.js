import {Router} from 'express'
import {addAudioToBattle} from '../controllers/media.controller.js'
import multer from 'multer';
const router = Router();

router.route("/:battleId/:rapperId/addaudio").post(multer().single('audio'), addAudioToBattle);
export default router;