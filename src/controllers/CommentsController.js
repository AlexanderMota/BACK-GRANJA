class CommentsController {
  constructor({ CommentsService }) {
    this.commentsService = CommentsService;
  }

  createComment = async (req, res) => {

    try {
      const user = req.user;
      //console.log('Usuario en PerfilController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const {comment} = req.body;
      const {idTarea} = req.params;

      comment.user_id = user.email;
      comment.task_id = idTarea;

      const newComment = await this.commentsService.createComment(comment);

      res.json({message: 'Comentario creado', comment: newComment});
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(401).json({ error: error.message });
    }
  };

  getCommentsByIdTarea = async (req, res) => {
    try {
      const user = req.user;
      console.log('Usuario en PerfilController:', user);
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const {idTarea} = req.params;

      const comments = await this.commentsService.getCommentsByIdTarea(idTarea);

      console.log('comments en PerfilController:', comments);
      res.json({message: 'Comentarios encontrados', comments: comments});
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(401).json({ error: error.message });
    }
  }

}

export default CommentsController;
  