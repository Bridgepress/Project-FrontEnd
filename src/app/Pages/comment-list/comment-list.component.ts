import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../chat/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent {
  @Input() comments?: Comment[] | null= [];
  @Input() user: any;
  @Output() replySubmitted = new EventEmitter<{ content: string, parentId: number | null }>();

  onReplySubmitted(reply: { content: string, parentId: number | null }): void {
    this.replySubmitted.emit(reply);
  }
}
