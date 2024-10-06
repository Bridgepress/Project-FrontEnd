import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../chat/comment.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as CommentsActions from '../chat/store/chat.actions';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() user: any;
  @Output() replySubmitted = new EventEmitter<{ content: string; parentId: number | null; userId: string }>();

  showReplies = false;
  replyToCommentId: number | null = null;
  expandedComments: { [key: number]: Comment[] } = {};

  constructor(private store: Store<fromApp.AppState>) {
    this.store.select(state => state.chat.expandedComments).subscribe(expandedComments => {
      this.expandedComments = expandedComments;
    });
  }

  toggleReplies() {
    if (!this.showReplies) {
      this.store.dispatch(new CommentsActions.LoadCommentTree(this.comment.id));
    }
    this.showReplies = !this.showReplies;
  }

  replyToComment() {
    this.replyToCommentId = this.comment.id;
  }

  onReplySubmitted(reply: { content: string; parentId: number | null }) {
    if (this.user?.id) {
      this.replySubmitted.emit({ ...reply, userId: this.user.id });
      this.replyToCommentId = null;
    }
  }
}
