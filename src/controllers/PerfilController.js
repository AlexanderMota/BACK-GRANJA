class PerfilController {
  constructor({ PerfilService }) {
    this.perfilService = PerfilService;
  }

  verperfil = async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });
      
      res.json({message: 'Mostrando perfil', user: user.email});
    } catch (error) {
      console.log('Error:', error.message);
      res.status(401).json({ error: error.message });
    }
  };
}

export default PerfilController;
  