import express from 'express';
import {
  getAllRappers,
  getRapperById,
  updateRapper,
  deleteRapper
} from '../controllers/rapper.controller.js';

// Optionally, add authentication/authorization middleware as needed
import { verifyRapperJWT } from '../middlewares/JWTAuth.middleware.js';

const router = express.Router();

// GET /api/rapper?search=&page=&limit=   (list, paginated, searchable)
router.get('/', getAllRappers);

// GET /api/rapper/:id   (get single rapper)
router.get('/:id', getRapperById);

// PUT /api/rapper/:id   (update rapper)
router.put('/:id', verifyRapperJWT, updateRapper);

// DELETE /api/rapper/:id   (delete rapper)
router.delete('/:id', verifyRapperJWT, deleteRapper);

export default router;
