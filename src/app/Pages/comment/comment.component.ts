import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../chat/comment.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as CommentsActions from '../chat/store/chat.actions';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() user: any;
  @Output() replySubmitted = new EventEmitter<{ content: string; parentId: number | null; userId: string }>();

  showReplies = false;
  replyToCommentId: number | null = null;
  expandedComments: { [key: number]: Comment[] } = {};
  replyContent: string = ''; 

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image']
    ]
  };

  constructor(private store: Store<fromApp.AppState>, private sanitizer: DomSanitizer) {
    this.store.select(state => state.chat.expandedComments).subscribe(expandedComments => {
      this.expandedComments = expandedComments;
    });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
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

  submitReply() {
    if (this.replyContent.trim() && this.user?.id) {
      this.replySubmitted.emit({
        content: this.replyContent, 
        parentId: this.comment.id, 
        userId: this.user.id
      });
      this.replyContent = '';
      this.replyToCommentId = null;
    }
  }

  onReplySubmitted(reply: { content: string; parentId: number | null }) {
    if (this.user?.id) {
      this.replySubmitted.emit({ ...reply, userId: this.user.id });
      this.replyToCommentId = null;
    }
  }
}
