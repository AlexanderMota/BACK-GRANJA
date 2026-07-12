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
  async getParentTasksByUserID(user_id) {
    const tasks = await this.taskRepository.getParentTasksByUserID(user_id);
    return tasks;
  }
  async getSubTasks(parent_task_id) {
    const tasks = await this.taskRepository.findSubTasks(parent_task_id);
    return tasks;
  }
  async getTasksByColaborating(user_id){
    const tasks = await this.taskRepository.findTasksByColaborating(user_id);
    return tasks;
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

  async updateTarea(id, tarea, user_id) {
    const updatedTarea = await this.taskRepository.update(id, tarea, user_id);

    return updatedTarea;
  }

  async deleteTarea(id, user_id) {
    const deletedTarea = await this.taskRepository.delete(id, user_id);

    return deletedTarea;
  }
}

export default TareasService;
