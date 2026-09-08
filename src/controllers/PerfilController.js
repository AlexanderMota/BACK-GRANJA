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

      const perservresp = await this.perfilService.updateAvatar( user.user_id, avatar_url );
      
      if(!perservresp) throw new Error("Error al actualizar el avatar");
      
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

      res.json({message: 'Perfil encontrado', user: perfil});

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

      res.json({message: 'Perfil actualizado', user: perfilAct});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
  actualizarPassword = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { password } = req.body;

      if(password.newPassword == password.currentPassword) throw new Error("La nueva contraseña es igual que la anterior");

      const perfilAct = await this.perfilService.actualizarPassword(user.user_id,  password.currentPassword, password.newPassword);

      if(!perfilAct) throw new Error("Tuvimos un problema al intentar actualizar la contraseña. Verifica que la contraseña actual sea correcta");

      res.json({message: 'Perfil actualizado.', user: user});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
    
  deleteFotoDePerfil = async (req, res) => {

    try {
      
      if (!req.user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const perfilAct = await this.perfilService.deleteAvatar(req.user.user_id);

      if(!perfilAct) throw new Error("Tuvimos un problema al intentar eliminar la foto de perfil");

      res.json({message: 'Perfil actualizado.', user: {avatar_url: null}});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
 
  deletePerfil = async (req, res) => {

    try {

      if (!req.user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const perfilAct = await this.perfilService.deletePerfil(req.user.user_id);

      if(!perfilAct) throw new Error("Tuvimos un problema al intentar eliminar el perfil");

      res.json({message: 'Perfil eliminado.', user: {}});
    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
}


export default PerfilController;
  