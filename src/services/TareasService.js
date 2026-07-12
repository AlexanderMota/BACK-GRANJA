class TareasService {
  constructor({ UserRepository, TareasRepository }) {
    this.userRepository = UserRepository;
    this.taskRepository = TareasRepository;
  }

  async createTarea(task) {
    const newTask = await this.taskRepository.create(task);

    return newTask;
  }

  /*
  async getAllTareas() {
    const task = await this.taskRepository.findAll();
    return task;
  }*/
  async getParentTasks() {
    const task = await this.taskRepository.findParentTasks();
    return task;
  }
  async getSubTasks(parent_task_id) {
    const task = await this.taskRepository.findSubTasks(parent_task_id);
    return task;
  }
  async getTareaById(id) {
    const task = await this.taskRepository.findById(id);
    return task;
  }
  
  async getPriorities() {
    const priorities = await this.taskRepository.findPriorities();
    return priorities;
  }
  async getStatus() {
    const status = await this.taskRepository.findStatus();
    return status;
  }

  async updateTarea(id, tarea) {
    const updatedTarea = await this.taskRepository.update(id, tarea);

    return updatedTarea;
  }

  async deleteTarea(id) {
    const deletedTarea = await this.taskRepository.delete(id);

    return deletedTarea;
  }
}

export default TareasService;
