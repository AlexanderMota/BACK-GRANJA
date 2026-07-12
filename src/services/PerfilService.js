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

    const { user_id, password, ...userSafe } = user; // Exclude sensitive fields
    
    return userSafe;
  }
  async crearPerfil(user) {
    user.user_id = randomUUID();
    user.password = await bcrypt.hash(user.password, 10);
    
    const newUser = await this.userRepository.register(user);

    return newUser;
  }
  async actualizarPerfil(email, perfil){
    console.log("datos del perfil para actualizar en PerfilService() => ", email, perfil);

    const newUser = await this.userRepository.putProfile(email, perfil);

    return newUser;
  }
}

export default PerfilService;
