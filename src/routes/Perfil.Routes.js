import { authMiddleware } from '../middlewares/AuthMiddleware.js';
import { uploadAvatar } from '../middlewares/UploadAvatar.js';
import { Router } from 'express';

export default ({ PerfilController }) => {
  const router = Router();

  router.get('/ver', authMiddleware, (req, res) => PerfilController.verPerfil(req, res));
  router.get('/buscar/:query', authMiddleware, (req, res) => PerfilController.searchUsers(req, res));

  router.post('/avatar', authMiddleware, uploadAvatar.single("avatar"),(req, res) => PerfilController.subirFotoDePerfil(req, res));

  router.put('/', authMiddleware, (req, res) => PerfilController.actualizarPerfil(req, res));
  return router;
};