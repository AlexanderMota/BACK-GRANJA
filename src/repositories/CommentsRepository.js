
class CommentsRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async create(comment) {
    const { task_id, user_id, content, parent_comment_id } = comment;
    const [result] = await this.DBPool.query(
      'INSERT INTO comments ( task_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
      [ task_id, user_id, content, parent_comment_id]
    );
    return { comment_id: result.insertId, ...comment };
  }
  async findByIdTarea(idTarea) {
    const rows = await this.DBPool.query('SELECT c.comment_id, c.task_id, u.username, u.avatar_url, c.content, c.created_at, c.updated_at, c.parent_comment_id FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.task_id = ? ORDER BY c.created_at ASC;', [idTarea]);
    
    return rows.length ? rows[0] : null;
  }
}

export default CommentsRepository;
