class CollaboratorsController {

  constructor({ PerfilService, CollaboratorsService }) {
    this.perfilService = PerfilService;
    this.collabsService = CollaboratorsService;
  }

  getCollabRequestByIdTask = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;

      const collabState = await this.collabsService.getCollabRequestByTaskId( id, user.user_id );

      //console.log("collabState", collabState);

      if(!collabState) return res.status(202).json({message: `No se encontró invitación para la tarea ${id} y el usuario ${user.user_id}`, invitation: {}});

      res.json({message: `Invitacion encontrada`, invitation: {
        request_task : {
          sender_user_id: collabState.sender_user_id,
          request_id: collabState.request_id,
          task_id: collabState.task_id,
          user_id: collabState.user_id,
          status: collabState.status,
          created_at: collabState.created_at,
          updated_at: collabState.updated_at
        },
        user : {
          username: collabState.username,
          avatar_url: collabState.avatar_url
        },
        task : {
          name: collabState.name,
          status: collabState.tstatus,
          priority: collabState.priority
        }
      }});
    }catch (error) {
      res.status(401).json( {error: error.message});
    }
  }
  getCollabRequestsByUserId = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const collabState = await this.collabsService.getCollabRequestsByUserId( user.user_id );

      res.json({message: `Invitacion encontrada`, invitation: {
        request_task : {
          request_id: collabState.request_id,
          task_id: collabState.task_id,
          user_id: collabState.user_id,
          status: collabState.status,
          created_at: collabState.created_at,
          updated_at: collabState.updated_at
        },
        user : {
          username: collabState.username,
          avatar_url: collabState.avatar_url
        },
        task : {
          name: collabState.name,
          status: collabState.status,
          priority: collabState.priority
        }
      }});
    }catch (error) {
      res.status(401).json( {error: error.message});
    }
  }
  getCollabsConfirmed = async (req, res) => {

    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;

      const usersCollabs = await this.collabsService.getCollabsConfirmed(id);

      res.json({
        message: `Colaboraciones confirmadas encontradas: ${usersCollabs.length}`,
        collaborators: usersCollabs.map(collab => ({
          request_task: {
            sender_user_id: collab.sender_user_id,
            request_id: collab.request_id,
            status: collab.status
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
  getCollabsPending = async (req, res) => {
    
    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;

      const usersCollabs = await this.collabsService.getCollabsPending(id);
      
      res.json({
        message: `Colaboraciones pendientes encontradas: ${usersCollabs.length}`,
        collaborators: usersCollabs.map(collab => ({
          request_task: {
            sender_user_id: collab.sender_user_id,
            request_id: collab.request_id,
            status: collab.status
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

  postCollabRequest = async (req, res) => {

    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;
      const { task_id } = req.query;
      let collabState;

      if(id == user.user_id) collabState = await this.collabsService.postCollabRequest(id, null, task_id);
      else collabState = await this.collabsService.postCollabRequest(id, user.user_id, task_id);

      const perfil = await this.perfilService.getUserById(id);

      res.json({
        message: 'Colaboracion solicitada', 
        collaborator: {
          request_task:{
            sender_user_id: collabState.sender_user_id?collabState.sender_user_id:null,
            request_id: collabState.request_id
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
      
      const collabState = await this.collabsService.putCollabRequest(id,user.user_id);

      res.json({message: 'Colaboracion solicitada', user: collabState});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }

  deleteCollabRequest = async (req, res) => {
    
    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;

      const collabState = await this.collabsService.deleteCollabRequest(id,user.user_id);

      res.json({message: 'Invitación de colaboración cancelada', user: collabState});

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
  deleteCollaboration = async (req, res) => {
    
    try {
      const user = req.user;
      
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const { id } = req.params;


      const collabState = await this.collabsService.deleteCollaboration(id,user.user_id);

      if(collabState) res.json({message: 'Colaboración eliminada', request_task: {request_id:id,status:'canceled'}})
      else throw new error('Algo ha ido mal');

    } catch (error){
      res.status(401).json({ error: error.message });
    }
  }
}

export default CollaboratorsController;
  