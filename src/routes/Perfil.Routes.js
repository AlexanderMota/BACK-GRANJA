import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

export default ({ PerfilController }) => {
  const router = Router();

  router.get('/ver', authMiddleware, (req, res) => PerfilController.verPerfil(req, res));

  router.put('/', authMiddleware, (req, res) => PerfilController.actualizarPerfil(req, res))

  return router;
};