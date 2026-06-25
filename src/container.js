// elementos del contenedor de inyección de dependencias
import { createContainer, asClass, asValue, asFunction } from 'awilix';

// configuración de la aplicación
import app from './server.js';
import { DBPool } from './config/index.js';

// routers
import {AuthRoutes,PerfilRoutes,TareasRoutes} from './routes/index.js';
import routes from './routes/routes.js';

// controladores
import {AuthController,PerfilController,TareasController} from './controllers/index.js';

// servicios
import {AuthService,PerfilService,TareasService} from './services/index.js';

// repositorios
import {UserRepository, TareasRepository} from './repositories/index.js';

// modelos
//import {User, Tarea} from './models/index.js';

// validaciones
import { UserValidations } from './validations/index.js';





const container = createContainer();
//  Registra la configuración de la aplicación
container.register({
  app: asClass(app).singleton(),
  routes: asFunction(routes).singleton(),
  DBPool: asValue(DBPool)
});

// Registrar Rutas
container.register({
  AuthRoutes: asFunction(AuthRoutes).singleton(),
  PerfilRoutes: asFunction(PerfilRoutes).singleton(),
  TareasRoutes: asFunction(TareasRoutes).singleton()
});

// Registrar Controladores
container.register({
  AuthController: asClass(AuthController).singleton(),
  PerfilController: asClass(PerfilController).singleton(),
  TareasController: asClass(TareasController).singleton()
});

// Registrar Servicios
container.register({
  AuthService: asClass(AuthService).singleton(),
  PerfilService: asClass(PerfilService).singleton(),
  TareasService: asClass(TareasService).singleton()
});

// Registrar Repositorios
container.register({
  UserRepository: asClass(UserRepository).singleton(),
  TareasRepository: asClass(TareasRepository).singleton()
});

// Registrar Modelos
/*container.register({
  User: asValue(User)
});*/

// Registrar Validaciones
container.register({
  UserValidations: asValue(UserValidations)
});

export default container;
