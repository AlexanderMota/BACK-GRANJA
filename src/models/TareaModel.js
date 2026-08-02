class Tarea {
    constructor( task_id, name, description, status, created_at, updated_at, parent_task_id, created_by, visibility ) {
      this.task_id = task_id;
      this.name = name;
      this.description = description;
      this.status = status;
      this.created_at = created_at;
      this.updated_at = updated_at;
      this.parent_task_id = parent_task_id;
      this.created_by = created_by;
      this.visibility = visibility;
    }
  }
  export default Tarea;