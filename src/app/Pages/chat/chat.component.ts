import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';
import * as fromApp from '../../store/app.reducer';
import * as CommentsActions from './store/chat.actions';
import { Store } from '@ngrx/store';
import { state } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent  implements OnInit {
  rootComments$: Observable<Comment[]>;
  expandedComments$: Observable<{ [key: number]: any[] }>
  commentForm: FormGroup | undefined;

  constructor(private store: Store<fromApp.AppState>, private fb: FormBuilder) {
    this.rootComments$ = store.select(state => state.chat.comments);
    this.expandedComments$ = store.select(state => state.chat.expandedComments);
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]],
      parentId: [null]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new CommentsActions.LoadRootComments());
  }

  toggleComment(commentId: number): void {
    this.store.dispatch(new CommentsActions.LoadCommentTree(commentId));
  }

  onSubmit(): void {
    
    if (this.commentForm != null && this.commentForm.valid) {
      const newComment = this.commentForm.value;
      this.store.dispatch(new CommentsActions.AddComment(newComment));
      this.commentForm.reset(); 
    }
  }

  replyToComment(commentId: number) {
    this.commentForm?.patchValue({ parentId: commentId });
  }
}
