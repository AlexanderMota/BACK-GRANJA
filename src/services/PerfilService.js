import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import fs from "fs/promises";
import path from "path";

class PerfilService {

  constructor({ UserRepository }) {
    this.userRepository = UserRepository;
  }

  async searchUsers( query, user_id, task_id ){
    return await this.userRepository.searchUsers( query, user_id, task_id );
  }

  async updateAvatar(user_id, avatar_url) {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const oldAvatar = user.avatar_url;

    const updatedUser =  await this.userRepository.updateAvatar( user_id, avatar_url );


    if (oldAvatar) {

        const oldPath = path.join(
            process.cwd(),
            "uploads",
            "avatars",
            oldAvatar
        );

        try {

            await fs.unlink(oldPath);

        } catch {
            // Si no existe el archivo no pasa nada.
        }

    }

    return updatedUser;

  }
  //cambiar a getUserById o getUserProfile
  async verPerfil(user_id) {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new Error('Usuario no encontrado');

    const { password, ...userSafe } = user; // Exclude sensitive fields
    
    return userSafe;
  }
  async crearPerfil(user) {
    user.user_id = randomUUID();
    user.password = await bcrypt.hash(user.password, 10);
    
    const newUser = await this.userRepository.register(user);

    return newUser;
  }
  async getCollabsConfirmed(task_id){
    return await this.userRepository.getCollabsConfirmed(task_id);
  }
  async getCollabsPending(task_id){
    return await this.userRepository.getCollabsPending(task_id);
  }
  async actualizarPerfil(user_id, perfil){
    //console.log("datos del perfil para actualizar en PerfilService() => ", user_id, perfil);

    const newUser = await this.userRepository.putProfile(user_id, perfil);

    return newUser;
  }
  async postCollabRequest(user_id, sender_user_id, task_id) {

    return await this.userRepository.postCollabRequest(user_id, sender_user_id, task_id);
  }
  async putCollabRequest(user_id, task_id){
    return await this.userRepository.putCollabRequest(user_id, task_id);

  }
}

export default PerfilService;
