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
      console.log(tarea);
      res.json({ message: 'Tarea encontrada.', tarea });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
  getPriorities = async (req, res) => {

    try {
      const user = req.user;
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      const priorities = await this.tareasService.getPriorities();
      res.json({ message: 'Prioridades encontradas.', priorities });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
  getStatus = async (req, res) => {

    try {
      const user = req.user;
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      const status = await this.tareasService.getStatus();
      res.json({ message: 'Status encontrados.', status });
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
      const {tarea} = req.body;
      tarea.created_by = user.email;
      const nuevaTarea = await this.tareasService.createTarea(tarea);

      res.status(201).json({ message: 'Tarea creada exitosamente.', tarea: nuevaTarea });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
  updateTarea = async (req, res) => {

    try {
      const user = req.user;
      //console.log('Usuario en TareasController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      const { id } = req.params;
      const {tarea} = req.body;
      const tareaActualizada = await this.tareasService.updateTarea(id, tarea);
      if (!tareaActualizada) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json({ message: 'Tarea actualizada exitosamente.', tarea: tareaActualizada });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
  deleteTarea = async (req, res) => {

    try {
      const user = req.user;
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      const { id } = req.params;
      const tareaEliminada = await this.tareasService.deleteTarea(id);
      if (!tareaEliminada) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json({ message: 'Tarea eliminada exitosamente.', tarea: tareaEliminada });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
}

export default TareasController;
  