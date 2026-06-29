class Comment {
    constructor( comment_id, task_id, user_id, content, created_at, updated_at, parent_task_id ) {
      this.comment_id = comment_id;
      this.task_id = task_id;
      this.user_id = user_id;
      this.content = content;
      this.created_at = created_at;
      this.updated_at = updated_at;
      this.parent_comment_id = parent_task_id;
    }
  }
  export default Comment;