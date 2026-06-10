import jwt from 'jsonwebtoken';

class AuthService {
  constructor({ UserRepository, UserValidations }) {
    this.UserRepository = UserRepository;
    this.UserVals = UserValidations;
  }

  async login(email, password) {
    let valid = false;

    if (!this.UserVals.validateEmail(email)) throw new Error('Formato email incorrecto');
    const user = await this.UserRepository.findByEmail(email);

    if (!user) throw new Error('Usuario no encontrado');

    // MUY IMPORTANTE: Reactivar esta linea ya que es la que compara la contraseña introducida por el usuario con la contraseña hasheada que debe haber almacenada en la base de datos. Desactivamos solo para pruebas.
    //if (!this.UserVals.validateComparePassword(password, user.password)) throw new Error('Contraseña incorrecta');
    if (user.password.startsWith('$2b$')) {
      valid = await bcrypt.compare(password, user.password);
    } else {
      valid = password === user.password;
    }

    if (!valid) throw new Error('Contraseña incorrecta');

    // Generar JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return { token, user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role_id } };
  }
}

export default AuthService;
