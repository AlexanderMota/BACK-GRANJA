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
    const newUser = await this.userRepository.updateProfile(user_id, perfil);

    return newUser;
  }
  async actualizarPassword( user_id, currentPassword, newPassword ){
    
    let valid = false;

    const user = await this.userRepository.findById(user_id);

    if(user) {
      if (user.password.startsWith('$2b$')) 
        valid = await bcrypt.compare(currentPassword, user.password);
      else
        valid = currentPassword === user.password;
    }
    
    if (!valid) throw new Error('Contraseña incorrecta');

    return await this.userRepository.updatePassword( user.user_id, user.password, await bcrypt.hash(newPassword, 10));
  }

  async deleteAvatar(user_id){

    const user = await this.getUserById(user_id);

    if (!user.avatar_url) {
        throw new Error("El usuario no tiene avatar");
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

        console.warn("No se pudo eliminar el fichero: ", err.message);

    }

    const updatedUserRep = await this.userRepository.updateAvatar(user.user_id, null);

    if(updatedUserRep.affectedRows > 0){

      user.avatar_url = null;

      return user;
    }else throw new Error('Hubo un problema inesperado al intentar realizar el cambio de contraseña');
  }
  async deleteProfile(user_id){
    return await this.userRepository.delete(user_id);
  }
}

export default PerfilService;
