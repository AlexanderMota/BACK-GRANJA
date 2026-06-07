import { Router } from 'express';
import swaggerUi from "swagger-ui-express";

import fs from "fs";
import path from "path";
const swaggerPath = path.resolve("src/config/swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

export default ({ AuthRoutes }) => {
  const router = Router();

  router.use((req, res, next) => {
    // Permitir el origen específico del frontend (Angular)
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // Permitir cookies y credenciales

    // Si la solicitud es de tipo OPTIONS (preflight), respondemos con un 200
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });

  router.use('/auth', AuthRoutes);

  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return router;
}