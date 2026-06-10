import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

export default ({ AuthController }) => {
  const router = Router();

  router.get('/me', authMiddleware, (req, res) => {
    
      res.json({
        authenticated: true,
        user: req.user
      });

    }
  );

  router.post('/login', (req, res) => AuthController.login(req, res));

  return router;
};