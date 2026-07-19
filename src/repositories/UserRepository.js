
class UserRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async register(user) {
    const [result] = await this.DBPool.query(`
      INSERT INTO users (
        user_id, 
        email, 
        password, 
        role_id ) 
      VALUES (?, ?, ?, ?)
      `, [
        user.user_id,
        user.email,
        user.password,
        5
      ]
    );
    return result.insertId;
  }
  async updateAvatar(user_id, avatar_url) {

    return await this.DBPool.query(`
      UPDATE users 
      SET avatar_url = ? 
      WHERE user_id = ?
    `, 
      [ avatar_url, user_id ]
    );

    //return this.findById(user_id);
  }

  async findByEmail(email) {
    const [rows] = await this.DBPool.query(`
      SELECT 
        user_id, 
        name, 
        lastname, 
        username, 
        email, 
        password,
        phone, 
        avatar_url, 
        role 
      FROM users 
      JOIN roles 
      ON users.role_id = roles.role_id 
      WHERE email = ?
      `, 
      [email]
    );
    return rows.length ? rows[0] : null;
  }
  async findById(id) {
    const [rows] = await this.DBPool.query( `
        SELECT * 
        FROM users 
        WHERE user_id = ?
      `, 
      [id]
    );
    return rows.length ? rows[0] : null;
  }
  async searchUsers(query, user_id, task_id) {

    const [rows] = await this.DBPool.query(`
      SELECT
        u.user_id,
        u.username,
        u.avatar_url
      FROM users u
      WHERE
        u.user_id <> ?
        AND NOT EXISTS (
            SELECT 1
            FROM user_tasks ut
            WHERE ut.user_id = u.user_id
              AND ut.task_id = ?
        )
        AND NOT EXISTS (
            SELECT 1
            FROM requests_task rt
            WHERE rt.user_id = u.user_id
              AND rt.task_id = ?
              AND rt.status = 'pending'
        )
        AND (
            u.username LIKE ?
            OR u.name LIKE ?
            OR u.lastname LIKE ?
            OR u.email LIKE ?
        )
      LIMIT 10
      `, [
        user_id, 
        task_id,
        task_id,
        `%${query}%`, 
        `%${query}%`,
        `%${query}%`, 
        `%${query}%`
      ]
    );

    return rows;
  }
  
  async getCollabsConfirmed(task_id){
    const [rows] = await this.DBPool.query(`
      SELECT users.user_id, users.avatar_url, users.username
      FROM user_tasks JOIN users
      ON   users.user_id = user_tasks.user_id
      WHERE	task_id = ?;
      `, [task_id]);

    return rows;
  }
  async getCollabsPending(task_id){
    const [rows] = await this.DBPool.query(`
      SELECT  
        users.user_id, 
        users.avatar_url, 
        users.username, 
        requests_task.sender_user_id, 
        requests_task.request_id
      FROM requests_task JOIN users
      ON   users.user_id = requests_task.user_id
      WHERE	task_id = ? AND \`status\` = 'pending';
      `, [task_id]);
    return rows;
  }
  async postCollabRequest(user_id, sender_user_id, task_id){


    const [rows] = await this.DBPool.query(`
      SELECT  *
      FROM requests_task
      WHERE	task_id = ? AND user_id = ? AND \`status\` = 'pending';
      `, [task_id, user_id]);


    if(rows.length > 0) {
      throw new Error(
          "Esta solicitud ya existe"
        );
    }

    const [result] = await this.DBPool.query(
      'INSERT INTO requests_task (user_id, sender_user_id, task_id) VALUES (?, ?, ?)',
      [user_id, sender_user_id, task_id]
    );
    
    return result;
  }
  async putCollabRequest(user_id, task_id){
    const [rows] = await this.DBPool.query(`
      SELECT  *
      FROM requests_task
      WHERE	task_id = ? AND user_id = ? AND \`status\` = 'pending';
      `, [task_id, user_id]);


    if(rows.length < 1) {
      throw new Error(
          "Esta colaboración no ha sido solicitada"
        );
    }

    await this.DBPool.query(
      `
        UPDATE requests_task 
        SET 
          status = 'accepted' 
        WHERE user_id = ? AND task_id = ?
      `, [ user_id, task_id ]
    );

    return await this.DBPool.query(
      'INSERT INTO user_tasks (user_id, task_id) VALUES (?, ?)',
      [user_id, task_id]
    );

  }
  async putProfile(user_id, profile){

    const { name, lastname, username, phone, avatar_url} = profile;
    const [result] = await this.DBPool.query(
      `
        UPDATE users 
        SET 
          name = ?, 
          lastname = ?, 
          username = ?, 
          phone = ?, 
          avatar_url = ?, 
          updated_at = NOW() 
        WHERE user_id = ?
      `, [
        name, 
        lastname, 
        username, 
        phone, 
        avatar_url, 
        user_id
      ]
    );

    return result.affectedRows > 0 ? profile : null;
  }
}

export default UserRepository;
