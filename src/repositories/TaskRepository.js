
class TareasRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async create(tarea) {
    const { name, description, status, priority, parent_task_id, created_by, visibility } = tarea;

    const [result] = await this.DBPool.query(`
      INSERT INTO tasks (
        name, 
        description, 
        status, 
        priority, 
        parent_task_id, 
        created_by,
        visibility
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        name, 
        description, 
        status, 
        priority, 
        parent_task_id, 
        created_by,
        visibility
      ]
    );
    return { task_id: result.insertId, ...tarea };
  }
  
  async findParentTasksByUserID(user_id) {
    const [rows] = await this.DBPool.query(`
      SELECT * 
      FROM tasks 
      WHERE parent_task_id is null and created_by = ?`
      , [user_id]
    );
   
    return rows;
  }
  async findSubTasks(parent_task_id) {
    const [rows] = await this.DBPool.query(`
        SELECT *
        FROM tasks 
        WHERE parent_task_id = ?
      `, [parent_task_id]
    );
    return rows;
  }
  
  async findPublicTasks(user_id) {
    const [rows] = await this.DBPool.query(`
      SELECT *
      FROM tasks
      WHERE visibility = 'public' AND created_by <> ? AND NOT EXISTS (
          SELECT 1
          FROM requests_task rt 
          WHERE rt.task_id = tasks.task_id
            AND rt.user_id = ?
      )
    `, [user_id, user_id]
    );
    return rows;
  }

  async findTasksByCollaborating(user_id) {
    const [rows] = await this.DBPool.query(`
        SELECT tasks.*
        FROM tasks 
        JOIN user_tasks 
          ON tasks.task_id = user_tasks.task_id 
       WHERE user_tasks.user_id = ?
      `, [user_id]);
    return rows;
  }
  async findTasksByCollabRequest(user_id) {
    const [rows] = await this.DBPool.query(`
        SELECT tasks.*
        FROM tasks JOIN requests_task 
        ON tasks.task_id = requests_task.task_id 
        WHERE requests_task.user_id = ? AND requests_task.status = 'pending'
      `, [user_id]
    );
    return rows;
  }
  async findById(task_id, user_id) {

    const [tar] = await this.DBPool.query(`
        SELECT *
        FROM tasks
        WHERE task_id = ?
      `, [task_id]
    );

    if (!tar.length) {
      throw new Error("Tarea no encontrada");
    }

    const [rows] = await this.DBPool.query(`
        SELECT
          t.*,
          u.username,
          u.avatar_url
        FROM tasks t
        JOIN users u
          ON u.user_id = t.created_by
        WHERE t.task_id = ? AND (
          t.created_by = ?
          OR EXISTS (
            SELECT 1
            FROM user_tasks ut
            WHERE ut.task_id = t.task_id
              AND ut.user_id = ?
          ) 
          OR EXISTS (
            SELECT 1
            FROM requests_task rt
            WHERE rt.task_id = t.task_id
              AND rt.user_id = ?
              AND rt.status = 'pending'
          )
          OR EXISTS (
            SELECT 1
            FROM tasks 
            WHERE visibility = 'public' AND task_id = ?
          )
        )
      `, [task_id, user_id, user_id, user_id, task_id]
    );

    if (!rows.length) {
      throw new Error("No tienes permiso para acceder a esta tarea");
    }
    
    return rows.length ? rows[0] : null;
  }/*
  async findByOwnerId(owner_id) {
    const [rows] = await this.DBPool.query('SELECT * FROM tasks WHERE created_by = ?', [owner_id]);
    return rows.length ? rows[0] : null;
  }*/
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
    const { name, description, status, priority, parent_task_id, visibility } = tarea;
    const [result] = await this.DBPool.query(`
        UPDATE tasks 
        SET 
          name = ?, 
          description = ?, 
          status = ?, 
          priority = ?, 
          parent_task_id = ?, 
          visibility = ?,
          updated_at = NOW() 
        WHERE task_id = ? AND created_by = ?
      `,
      [ 
        name, 
        description, 
        status, 
        priority, 
        parent_task_id, 
        visibility, 
        id, 
        user_id 
      ]
    );
    return result.affectedRows > 0 ? { task_id: id, ...tarea } : null;
  }

  async delete(id, user_id) {
    const [result] = await this.DBPool.query('DELETE FROM tasks WHERE task_id = ? and created_by = ?', [id, user_id]);
    return result.affectedRows > 0;
  }
}

export default TareasRepository;

