import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

export default ({ TareasController }) => {
  const router = Router();

  router.get('/all', authMiddleware, (req, res) => TareasController.getAllTareas(req, res));
  router.get('/:id', authMiddleware, (req, res) => TareasController.getTareaById(req, res));
  router.post('/', authMiddleware, (req, res) => TareasController.createTarea(req, res));

  return router;
};