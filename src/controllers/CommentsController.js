class CommentsController {
  constructor({ CommentsService }) {
    this.commentsService = CommentsService;
  }

  createComment = async (req, res) => {

    try {
      const user = req.user;
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const {comment} = req.body;

      const {id} = req.params;

      comment.user_id = user.user_id;
      comment.task_id = id;
      //console.log('Comentario nuevo (createComment): ', comment);

      const newComment = await this.commentsService.createComment(comment);

      res.json({message: 'Comentario creado', comment: newComment});
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  getCommentsByIdTarea = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const {id} = req.params;

      const comments = await this.commentsService.getCommentsByIdTarea(id);

      res.json({message: 'Comentarios encontrados', comments: comments});
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
  updateComment = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const {id} = req.params;
      const {comment} = req.body;

      const updatedComment = await this.commentsService.updateComment(id, comment.content);

      res.json({message: 'Comentario actualizado', comment: updatedComment});
    } catch (error) {
      res.status(401).json({ error: error.message});
    }
  }

  deleteComment = async (req, res) => {
    try {
      const user = req.user;

      if (!user) return res.status(400).json({ error: 'Usuario no autenticado' });

      const {id} = req.params;

      const deletedComment = await this.commentsService.deleteComment(id, user.user_id);

      res.json({message: 'Comentario eliminado', comment: deletedComment});
    } 
    catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default CommentsController;