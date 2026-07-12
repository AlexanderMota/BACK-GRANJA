
class CommentsRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async create(comment) {
    try {
    
    const { task_id, user_id, content, parent_comment_id } = comment;
    const [result] = await this.DBPool.query(
      'INSERT INTO comments ( task_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
      [ task_id, user_id, content, parent_comment_id]
    );
    return { comment_id: result.insertId, ...comment };

      } catch (error) {

      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          throw new Error(
              'No se puede añadir un comentario a una tarea que no existe'
          );
      }

      return error;
    } 
  }
  async findById(comment_id) {
    const rows = await this.DBPool.query('SELECT c.comment_id, c.task_id, u.user_id,u.username, u.avatar_url, c.content, c.created_at, c.updated_at, c.parent_comment_id FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.comment_id = ? ORDER BY c.created_at ASC;', [comment_id]);
    return rows.length ? rows[0] : null;
  }
  async findByIdTarea(task_id) {
    const rows = await this.DBPool.query('SELECT c.comment_id, c.task_id, u.user_id,u.username, u.avatar_url, c.content, c.created_at, c.updated_at, c.parent_comment_id FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.task_id = ? ORDER BY c.created_at ASC;', [task_id]);
    
    return rows.length ? rows[0] : null;
  }
  async updateComment(comment_id, content){
    const [result] = await this.DBPool.query(
      'UPDATE comments SET content = ? WHERE comment_id = ?',
      [content, comment_id]
    );
    return result.affectedRows > 0;
  }
  async deleteComment(comment_id, user_id) {
    const [result] = await this.DBPool.query(
      'DELETE FROM comments WHERE comment_id = ? AND user_id = ?',
      [comment_id, user_id]
    );
    return result.affectedRows > 0;
  }
}

export default CommentsRepository;
