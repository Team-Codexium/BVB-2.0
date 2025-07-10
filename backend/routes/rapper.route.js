import express from 'express';
import {
  getAllRappers,
 
  updateRapper,
  deleteRapper,
  getRapperProfile,
  getLoggedInRapperProfile
} from '../controllers/rapper.controller.js';

// Optionally, add authentication/authorization middleware as needed
import { verifyRapperJWT } from '../middlewares/JWTAuth.middleware.js';

const router = express.Router();

// GET /api/rapper?search=&page=&limit=   (list, paginated, searchable)
router.get('/', getAllRappers);

// GET /api/rapper/:id   (get single rapper)
router.get('/:id', getRapperProfile);

// PUT /api/rapper/:id   (update rapper)
router.put('/:id', verifyRapperJWT, updateRapper);

// DELETE /api/rapper/:id   (delete rapper)
router.delete('/:id', verifyRapperJWT, deleteRapper);

// GET /api/rapper/profile (get profile of loggedin rapper)
router.get('/profile', verifyRapperJWT, getLoggedInRapperProfile);

export default router;
