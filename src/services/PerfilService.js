import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

class PerfilService {
  constructor({ UserRepository }) {
    this.userRepository = UserRepository;
  }

  //cambiar a getUserById o getUserProfile
  async verPerfil(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');
    const { password, ...userSafe } = user; // Exclude sensitive fields
    return userSafe;
  }
  async crearPerfil(user) {
    user.user_id = randomUUID();
    user.password = await bcrypt.hash(user.password, 10); // Hash the password before saving
//console.log('Datos recibidos para crear perfil en PerfilService:', user);
    const newUser = await this.userRepository.register(user);
    return newUser;
  }
}

export default PerfilService;
