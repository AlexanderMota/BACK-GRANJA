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

      // REVISAR seguramente no haga falta este const user, solo el await
      const updatedUser = await this.perfilService.updateAvatar( user.user_id, avatar_url );



      res.json({
          message: "Avatar actualizado",
          user: {
            avatar_url: req.file.filename
          }
      });
      
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  verPerfil = async (req, res) => {

    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const perfil = await this.perfilService.verPerfil(user.user_id);

      res.json({message: 'Perfil encontrado.', user: perfil});

    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
  
  getCollabsConfirmed = async (req, res) => {

    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;

      const usersCollabs = await this.perfilService.getCollabsConfirmed(id);

      res.json({message: 'Perfiles encontrados', users: usersCollabs});

    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  getCollabsPending = async (req, res) => {
    
    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;

      const usersCollabs = await this.perfilService.getCollabsPending(id);
      
      res.json({
        message: 'Colaboraciones pendientes encontradas',
        collaborators: usersCollabs.map(collab => ({
          request_task: {
            sender_user_id: collab.sender_user_id,
            request_id: collab.request_id
          },
          user: {
            user_id: collab.user_id,
            username: collab.username,
            avatar_url: collab.avatar_url
          }
        }))
      });

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
  postCollabRequest = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;
      const { task_id } = req.query;
      //let collabState;


      if(id == user.user_id) {
        //console.log(`usuario ${id} solicita colaborar en esta tarea ${task_id}`);
        /*collabState = */await this.perfilService.postCollabRequest(id, null, task_id);
        // esto debe generar una notificacion para el creador de la tarea
      } else {
        //console.log(`creador de la tarea ${task_id} solicita colaboracion del usuario ${id}`);
        /*collabState = */await this.perfilService.postCollabRequest(id, user.user_id, task_id);
        // eso debe generar una notificacion para el usuario solicitado
      }

      const perfil = await this.perfilService.verPerfil(id);

      res.json({
        message: 'Colaboracion solicitada', 
        collaborator: {
          request_task_id:{
            sender_user_id: perfil.sender_user_id,
            request_id: perfil.request_id
          },
          user: {
            user_id:perfil.user_id,
            username: perfil.username,
            avatar_url:perfil.avatar_url
          }
        }
      });

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }

  putCollabRequest = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;
      const { task_id } = req.query;

      
      console.log("collabState", id,task_id);
      const collabState = await this.perfilService.putCollabRequest(id, task_id);


      res.json({message: 'Colaboracion solicitada', user: collabState});




    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }

}

export default PerfilController;
  