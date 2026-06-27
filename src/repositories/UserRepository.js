
class UserRepository {
  constructor({ DBPool }) {
    this.DBPool = DBPool;
  }

  async register(user) {
    const [result] = await this.DBPool.query('INSERT INTO users (user_id, email, password, role_id) VALUES (?, ?, ?, ?)', [
      user.user_id,
      user.email,
      user.password,
      5
    ]);
    return result.insertId;
  }/*
  async create(user) {
    const [result] = await this.DBPool.query('INSERT INTO users (name, lastname, username, email, password, phone, avatar_url, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      user.name,
      user.lastname,
      user.username,
      user.email,
      user.password,
      user.phone,
      user.avatar_url,
      user.role_id
    ]);
    return result.insertId;
  }*/
  async findByEmail(email) {
    const [rows] = await this.DBPool.query('SELECT user_id, name, lastname, username, email, password, phone, avatar_url, role_id FROM users WHERE email = ?', [email]);
    return rows.length ? rows[0] : null;
  }
  async findById(id) {
    const [rows] = await this.DBPool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }
}

export default UserRepository;
