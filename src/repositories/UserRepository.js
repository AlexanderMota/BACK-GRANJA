
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
  }
  async findByEmail(email) {
    const [rows] = await this.DBPool.query('SELECT user_id, name, lastname, username, email, password, phone, avatar_url, role FROM users JOIN roles ON users.role_id = roles.role_id WHERE email = ?', [email]);
    return rows.length ? rows[0] : null;
  }
  async findById(id) {
    const [rows] = await this.DBPool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows.length ? rows[0] : null;
  }
  async putProfile(email, profile){

    const { name, lastname, username, phone, avatar_url} = profile;
    const [result] = await this.DBPool.query(
      'UPDATE users SET name = ?, lastname = ?, username = ?, phone = ?, avatar_url = ?, updated_at = NOW() WHERE email = ?',
      [name, lastname, username, phone, avatar_url, email]
    );
    return result.affectedRows > 0 ? { email: email, ...profile } : null;
  }
}

export default UserRepository;
