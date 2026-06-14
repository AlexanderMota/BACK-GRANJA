class PerfilService {
  constructor({ UserRepository }) {
    this.UserRepository = UserRepository;
  }

  //cambiar a getUserById o getUserProfile
  async verperfil(user_id) {
    const user = await this.UserRepository.findById(user_id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }
}

export default PerfilService;
