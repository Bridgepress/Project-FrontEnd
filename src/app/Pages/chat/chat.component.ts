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
  rootComments$: Observable<{ comments: Comment[], totalItems: number }>;
  user: any;
  page: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 1;
  pageSizes: number[] = [5, 10, 20];

  constructor(private store: Store<fromApp.AppState>, private accountRequests: AccountRequests) {
    this.rootComments$ = store.select(state => ({
      comments: state.chat.comments,
      totalItems: state.chat.totalItems
    }));
  }

  ngOnInit() {
    this.loadComments();
    this.accountRequests.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  loadComments() {
    this.store.dispatch(new CommentsActions.LoadRootComments(this.page, this.pageSize));
    this.rootComments$.subscribe(response => {
      if (response) {
        this.totalItems = response.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      }
    });
  }

  onNextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadComments();
    }
  }

  onPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadComments();
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.page = 1;
    this.loadComments();
  }

  onCommentSubmitted(comment: { content: string, parentId: number | null, userId: string }) {
    this.store.dispatch(new CommentsActions.AddComment(comment, this.page, this.pageSize));
  }

  paginationNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.loadComments();
  }
}
