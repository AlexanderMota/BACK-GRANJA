class CommentsService {
  constructor({ UserRepository, CommentsRepository }) {
    this.commentsRepository = CommentsRepository;
    this.userRepository = UserRepository;
  }

  async createComment(comment) {
    
    const user = await this.userRepository.findByEmail(comment.user_id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    comment.user_id = user.user_id; // Asignar el ID del usuario autenticado como creador de la tarea
    //console.log('Tarea procesada en TareasService:', tarea);


    const newComment = await this.commentsRepository.create(comment);
    return newComment;
  }

  async getCommentsByIdTarea(idTarea){

    const comments = await this.commentsRepository.findByIdTarea(idTarea);
    return comments;
  }
}

export default CommentsService;