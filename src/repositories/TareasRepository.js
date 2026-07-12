
class TareasRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async create(tarea) {
    const { name, description, status, priority, parent_task_id, created_by } = tarea;
    const [result] = await this.DBPool.query(
      'INSERT INTO tasks (name, description, status, priority, parent_task_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, status, priority, parent_task_id, created_by]
    );
    return { task_id: result.insertId, ...tarea };
  }

  async findAll() {
    const [rows] = await this.DBPool.query('SELECT task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks');
    return rows;
  }
  async getParentTasksByUserID(user_id) {
    const [rows] = await this.DBPool.query('SELECT task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks WHERE parent_task_id is null and created_by = ?', [user_id]);
    return rows;
  }
  async findSubTasks(parent_task_id) {
    const [rows] = await this.DBPool.query('SELECT task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks WHERE parent_task_id = ?', [parent_task_id]);
    return rows;
  }
  async findTasksByColaborating(user_id) {
    const [rows] = await this.DBPool.query('SELECT tasks.task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks join user_tasks ON tasks.task_id = user_tasks.task_id WHERE user_tasks.user_id = ? and parent_task_id is null', [user_id]);
    return rows;
  }
  async findById(id) {
    const [rows] = await this.DBPool.query('SELECT created_by, task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks WHERE task_id = ?', [id]);
    return rows.length ? rows[0] : null;
  }
  async findByOwnerId(owner_id) {
    const [rows] = await this.DBPool.query('SELECT * FROM tasks WHERE created_by = ?', [owner_id]);
    return rows.length ? rows[0] : null;
  }
  async findByParentId(parent_id) {
    const [rows] = await this.DBPool.query('SELECT * FROM tasks WHERE parent_task_id = ?', [parent_id]);
    return rows.length ? rows[0] : null;
  }

  async findPriorities() {
    const [rows] = await this.DBPool.query("SHOW COLUMNS FROM tasks LIKE 'priority'");
    
    const enumValues = rows[0].Type
      .match(/enum\((.*)\)/)[1]
      .replace(/'/g, '')
      .split(',');
    
    return enumValues;
  }
  async findStatus() {
    const [rows] = await this.DBPool.query("SHOW COLUMNS FROM tasks LIKE 'status'");
    
    const enumValues = rows[0].Type
      .match(/enum\((.*)\)/)[1]
      .replace(/'/g, '')
      .split(',');
    
    return enumValues;
  }

  async update(id, tarea, user_id) {
    const { name, description, status, priority, parent_task_id} = tarea;
    const [result] = await this.DBPool.query(
      'UPDATE tasks SET name = ?, description = ?, status = ?, priority = ?, parent_task_id = ?, updated_at = NOW() WHERE task_id = ? and created_by = ?',
      [name, description, status, priority, parent_task_id, id, user_id]
    );
    return result.affectedRows > 0 ? { task_id: id, ...tarea } : null;
  }

  async delete(id, user_id) {
    const [result] = await this.DBPool.query('DELETE FROM tasks WHERE task_id = ? and created_by = ?', [id, user_id]);
    return result.affectedRows > 0;
  }
}

export default TareasRepository;
