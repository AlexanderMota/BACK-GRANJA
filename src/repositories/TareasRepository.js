
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
}

export default TareasRepository;
