class PerfilController {
  constructor({ PerfilService }) {
    this.perfilService = PerfilService;
  }

  searchUsers = async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { query } = req.params;
      const { task_id } = req.query;

      const usersResult = await this.perfilService.searchUsers( query, user.user_id, task_id );

      res.json({message: `Perfiles encontrados (${usersResult.length})`, users: usersResult});
    }catch (error) {
      res.status(401).json( {error: error.message});
    }
  }
  subirFotoDePerfil = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const avatar_url = req.file.filename;

      await this.perfilService.updateAvatar( user.user_id, avatar_url );

      res.json({
          message: "Avatar actualizado",
          user: {
            avatar_url: req.file.filename
          }
      });
      
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  verPerfil = async (req, res) => {

    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const perfil = await this.perfilService.getUserById(user.user_id);

      res.json({message: 'Perfil encontrado.', user: perfil});

    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
  
  actualizarPerfil = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { perfil } = req.body;

      const perfilAct = await this.perfilService.actualizarPerfil(user.user_id, perfil);

      res.json({message: 'Perfil actualizado.', user: perfilAct});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
    
  deleteFotoDePerfil = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });


      const perfilAct = await this.perfilService.deleteAvatar(user.user_id);


      res.json({message: 'Perfil actualizado.', user: perfilAct});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
 
}


export default PerfilController;
  