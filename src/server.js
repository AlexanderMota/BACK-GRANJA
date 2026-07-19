import cookieParser from 'cookie-parser';
//import cors from "cors"; //Borrar la dependencia si no la usamos mas adelante.
import express from "express";
import path from "path";

let app = null;

export default class Server {
  constructor({ routes }) {
    //esta forma esta fallando.
    /*app = express()
      .use(cors({
        origin: 'http://localhost:4200', // Permitir solicitudes solo desde el frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
        allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
      }))
      .use(express.json())
      .use(routes).options('*', cors());*/

      app = express()
        .use(cookieParser())
        .use(express.json())
        .use(routes)
        .use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  }

  start() {
    return new Promise(resolve => {
        app.listen(process.env.PORT, () => {
        console.log(
          "API running on port " + process.env.PORT
        );

        resolve();
      });
    });
  }
}
