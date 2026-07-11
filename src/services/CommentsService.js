class CommentsService {
  constructor({ UserRepository, CommentsRepository }) {
    this.commentsRepository = CommentsRepository;
    this.userRepository = UserRepository;
  }

  async createComment(comment) {
    
    const user = await this.userRepository.findById(comment.user_id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const newComment = await this.commentsRepository.create(comment);

    const resComment = await this.commentsRepository.findById(newComment.comment_id);
    return resComment[0];
  }

  async getCommentsByIdTarea(task_id){

    const comments = await this.commentsRepository.findByIdTarea(task_id);
    return comments;
  }
  async updateComment(comment_id, content){
    const updatedComment = await this.commentsRepository.updateComment(comment_id, content);
    return updatedComment;
  }

  async deleteComment(comment_id, user_id) {
    const delComment = await this.commentsRepository.deleteComment(comment_id, user_id);

    return delComment;
  }
}

export default CommentsService;