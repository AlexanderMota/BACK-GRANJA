
class TareasRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }
  async findAll() {
    const [rows] = await this.DBPool.query('SELECT task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks');
    return rows;
  }
  async findById(id) {
    const [rows] = await this.DBPool.query('SELECT task_id, name, description, status, priority, created_at, updated_at, parent_task_id FROM tasks WHERE task_id = ?', [id]);
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
    
    //console.log('Priorities retrieved from database:', enumValues);
    return enumValues;
  }
  
  async findStatus() {
    const [rows] = await this.DBPool.query("SHOW COLUMNS FROM tasks LIKE 'status'");
    //console.log('Status retrieved from database:', rows);
    const enumValues = rows[0].Type
      .match(/enum\((.*)\)/)[1]
      .replace(/'/g, '')
      .split(',');
    
    //console.log('Status retrieved from database:', enumValues);
    return enumValues;
  }

  async create(tarea) {
    const { name, description, status, priority, parent_task_id, created_by } = tarea;
    const [result] = await this.DBPool.query(
      'INSERT INTO tasks (name, description, status, priority, parent_task_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, status, priority, parent_task_id, created_by]
    );
    return { task_id: result.insertId, ...tarea };
  }

  async update(id, tarea) {
    const { name, description, status, priority, parent_task_id} = tarea;
    const [result] = await this.DBPool.query(
      'UPDATE tasks SET name = ?, description = ?, status = ?, priority = ?, parent_task_id = ?, updated_at = NOW() WHERE task_id = ?',
      [name, description, status, priority, parent_task_id, id]
    );
    return result.affectedRows > 0 ? { task_id: id, ...tarea } : null;
  }

  async delete(id) {
    const [result] = await this.DBPool.query('DELETE FROM tasks WHERE task_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default TareasRepository;
