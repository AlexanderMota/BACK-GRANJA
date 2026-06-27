class TareasService {
  constructor({ UserRepository, TareasRepository }) {
    this.userRepository = UserRepository;
    this.taskRepository = TareasRepository;
  }

  //cambiar a getUserById o getUserProfile
  async getAllTareas() {
    const tareas = await this.taskRepository.findAll();
    return tareas;
  }
  
  async getTareaById(id) {
    const tarea = await this.taskRepository.findById(id);
    return tarea;
  }
  
  async getPriorities() {
    const priorities = await this.taskRepository.findPriorities();
    return priorities;
  }
  async getStatus() {
    const status = await this.taskRepository.findStatus();
    return status;
  }

  async createTarea(tarea) {
    //console.log('Tarea recibida en TareasService:', tarea);
    const user = await this.userRepository.findByEmail(tarea.created_by);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    tarea.created_by = user.user_id; // Asignar el ID del usuario autenticado como creador de la tarea
    //console.log('Tarea procesada en TareasService:', tarea);

    const newTarea = await this.taskRepository.create(tarea);
    return newTarea;
    //return "Tarea no creada. Funcionalidad deshabilitada temporalmente por pruebas.";
  }

  async updateTarea(id, tarea) {
    const updatedTarea = await this.taskRepository.update(id, tarea);

    return updatedTarea;
    //return "Tarea no actualizada. Funcionalidad deshabilitada temporalmente por pruebas.";
  }

  async deleteTarea(id) {
    const deletedTarea = await this.taskRepository.delete(id);
    return deletedTarea;
  }
}

export default TareasService;
