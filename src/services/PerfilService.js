import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import fs from "fs/promises";
import path from "path";

class PerfilService {

  constructor({ UserRepository }) {
    this.userRepository = UserRepository;
  }

  async crearPerfil(user) {

    user.user_id = randomUUID();
    user.password = await bcrypt.hash(user.password, 10);

    return await this.userRepository.register(user);
  }

  //cambiar a getUserById o getUserProfile
  async getUserById(user_id) {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new Error('Usuario no encontrado');

    const { password, ...userSafe } = user; // Exclude sensitive fields
    
    return userSafe;
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
  async actualizarPerfil(user_id, perfil){
    //console.log("datos del perfil para actualizar en PerfilService() => ", user_id, perfil);

    const newUser = await this.userRepository.putProfile(user_id, perfil);

    return newUser;
  }

  async deleteAvatar(user_id){

    const user = await this.verPerfil(user_id);

    if (!user.avatar_url) {
        throw new Error("El usuario no tiene avatar.");
    }

     const filePath = path.join(
        process.cwd(),
        "uploads",
        "avatars",
        user.avatar_url
    );

    try {

        await fs.unlink(filePath);

    } catch (err) {

        console.warn("No se pudo eliminar el fichero:", err.message);

    }

    const updatuserRep = await this.userRepository.updateAvatar(user.user_id, null);

    if(updatuserRep.affectedRows > 0){

      user.avatar_url = null;

      return user;
    }
  }
}

export default PerfilService;
