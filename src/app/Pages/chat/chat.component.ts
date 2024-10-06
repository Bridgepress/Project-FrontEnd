import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';
import * as fromApp from '../../store/app.reducer';
import * as CommentsActions from './store/chat.actions';
import { Store } from '@ngrx/store';
import { AccountRequests } from '../auth/Requests/AccountRequests';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  rootComments$: Observable<Comment[]>;
  user: any;

  constructor(private store: Store<fromApp.AppState>, private accountRequests: AccountRequests) {
    this.rootComments$ = store.select(state => state.chat.comments);
  }

  ngOnInit() {
    this.store.dispatch(new CommentsActions.LoadRootComments());
    this.accountRequests.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onCommentSubmitted(comment: { content: string, parentId: number | null, userId: string }) {
    this.store.dispatch(new CommentsActions.AddComment(comment));
  }
}

