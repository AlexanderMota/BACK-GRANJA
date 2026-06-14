import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

export default ({ PerfilController }) => {
  const router = Router();

  router.get('/ver', authMiddleware, (req, res) => PerfilController.verperfil(req, res));

  return router;
};