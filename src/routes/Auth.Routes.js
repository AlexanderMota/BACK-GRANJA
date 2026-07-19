import { authMiddleware } from '../middlewares/AuthMiddleware.js';
import { Router } from 'express';

export default ({ AuthController }) => {
  const router = Router();

  router.get('/me', authMiddleware, (req, res) => AuthController.getMe(req, res));

  router.post('/register', (req, res) => AuthController.crearPerfil(req, res));
  router.post('/login', (req, res) => AuthController.login(req, res));
  router.post('/logout', authMiddleware, (req, res) => AuthController.logout(req, res));

  return router;
};