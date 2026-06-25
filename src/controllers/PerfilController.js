class PerfilController {
  constructor({ PerfilService }) {
    this.perfilService = PerfilService;
  }

  verPerfil = async (req, res) => {

    try {
      const user = req.user;
      //console.log('Usuario en PerfilController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const perfil = await this.perfilService.verPerfil(user.email);

      res.json({message: 'Perfil encontrado.', user: perfil});
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(401).json({ error: error.message });
    }
  };
}

export default PerfilController;
  