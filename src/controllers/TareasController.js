class TareasController {
  constructor({ TareasService }) {
    this.tareasService = TareasService;
  }

  //Para pruebas. Es importante proteger mas este endpoint o clausurarlo en produccion. Solo para pruebas de desarrollo.
  getAllTareas = async (req, res) => {

    try {
      const user = req.user;
      //console.log('Usuario en TareasController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const tareas = await this.tareasService.getAllTareas();
      
      res.json({ message: 'Tareas encontradas.', tareas });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(401).json({ error: error.message });
    }
  };
  getTareaById = async (req, res) => {

    try {
      const user = req.user;
      //console.log('Usuario en TareasController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      const { id } = req.params;
      const tarea = await this.tareasService.getTareaById(id);
      if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json({ message: 'Tarea encontrada.', tarea });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
  createTarea = async (req, res) => {

    try {
      const user = req.user;
      //console.log('Usuario en TareasController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      const tareaData = req.body;
      const nuevaTarea = await this.tareasService.createTarea(tareaData);

      res.status(201).json({ message: 'Tarea creada exitosamente.', tarea: nuevaTarea });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

export default TareasController;
  