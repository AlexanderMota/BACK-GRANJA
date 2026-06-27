import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

export default ({ TareasController }) => {
  const router = Router();

  router.get('/all', authMiddleware, (req, res) => TareasController.getAllTareas(req, res));
  router.get('/tarea/:id', authMiddleware, (req, res) => TareasController.getTareaById(req, res));
  router.get('/prioridades', authMiddleware, (req, res) => TareasController.getPriorities(req, res));
  router.get('/estatus', authMiddleware, (req, res) => TareasController.getStatus(req, res));

  router.post('/', authMiddleware, (req, res) => TareasController.createTarea(req, res));
  
  router.put('/tarea/:id', authMiddleware, (req, res) => TareasController.updateTarea(req, res));
  
  router.delete('/tarea/:id', authMiddleware, (req, res) => TareasController.deleteTarea(req, res));

  return router;
};