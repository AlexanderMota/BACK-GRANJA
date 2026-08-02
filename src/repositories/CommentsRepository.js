
class CommentsRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async canAccessTask(task_id, user_id) {

    const [rows] = await this.DBPool.query(`
      SELECT 1
      FROM tasks t
      WHERE t.task_id = ?
        AND (
          t.created_by = ?
          OR t.visibility = 'public'
          OR EXISTS (
            SELECT 1
            FROM user_tasks ut
            WHERE ut.task_id = t.task_id
              AND ut.user_id = ?
          )
        )
      LIMIT 1
    `, [task_id, user_id, user_id]);

    return rows.length > 0;
  }


  async create(comment) {
    try {

      if (!(await this.canAccessTask(comment.task_id, comment.user_id))) 
        throw new Error("No tienes permisos para comentar esta tarea.");

      const { task_id, user_id, content, parent_comment_id } = comment;
      const [result] = await this.DBPool.query(
        'INSERT INTO comments ( task_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
        [ task_id, user_id, content, parent_comment_id]
      );
      return { comment_id: result.insertId, ...comment };

    } catch (error) {

      if (error.code === 'ER_NO_REFERENCED_ROW_2') 
          throw new Error('No se puede añadir un comentario a una tarea que no existe');

      return error;
    } 
  }
  async findById(comment_id, user_id) {
    
    const rows = await this.DBPool.query(`
      SELECT c.*, u.username, u.avatar_url
      FROM comments c 
      JOIN users u ON c.user_id = u.user_id 
      WHERE c.comment_id = ? 
      ORDER BY c.created_at ASC
    `, [comment_id]);

    if (!(await this.canAccessTask(rows[0].task_id, user_id))) 
      throw new Error("No tienes permisos para ver este comentario.");

    return rows.length ? rows[0] : null;
  }
  async findByIdTarea(task_id, user_id) {

    if (!(await this.canAccessTask(task_id, user_id))) 
      throw new Error("No tienes permisos para ver estos comentarios.");

    const rows = await this.DBPool.query(`
      SELECT c.*, u.username, u.avatar_url 
      FROM comments c JOIN users u 
        ON c.user_id = u.user_id 
      WHERE c.task_id = ?
      ORDER BY c.created_at ASC;
    `, [task_id,user_id,user_id]);
    
    return rows.length ? rows[0] : null;
  }
  async updateComment(comment_id, user_id, content){

    if (await this.findById(comment_id, user_id)) 
      throw new Error("No tienes permisos para editar este comentario.");
    
    const [result] = await this.DBPool.query(
      'UPDATE comments SET content = ? WHERE comment_id = ?',
      [content, comment_id]
    );
    return result.affectedRows > 0;
  }
  async deleteComment(comment_id, user_id) {

    if (await this.findById(comment_id, user_id)) 
      throw new Error("No tienes permisos para eliminar este comentario.");

    const [result] = await this.DBPool.query(
      'DELETE FROM comments WHERE comment_id = ? AND user_id = ?',
      [comment_id, user_id]
    );
    return result.affectedRows > 0;
  }
}

export default CommentsRepository;
