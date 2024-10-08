import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';
import * as fromApp from '../../store/app.reducer';
import * as CommentsActions from './store/chat.actions';
import { Store } from '@ngrx/store';
import { AccountRequests } from '../auth/Requests/AccountRequests';
import { ToastrService } from 'ngx-toastr';

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
  pageSizes: number[] = [5, 10, 25];
  sortCriteria: string = 'userName'; 
  sortOrder: string = 'asc'; 
  siteKey: string = '6LdAUlkqAAAAAEmYtj99fO6S_R9HZIhFvASDUu_6';
  isCaptchaVerified: boolean = false;
  captchaToken: string = '';

  constructor(private store: Store<fromApp.AppState>, private accountRequests: AccountRequests, private toastr: ToastrService) {
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
    this.store.dispatch(new CommentsActions.LoadRootComments(this.page, this.pageSize, this.sortCriteria, this.sortOrder));
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

  onPageSizeChange(newPageSize: number) {
    this.pageSize = newPageSize;
    this.page = 1;
    this.loadComments();
  }

  onCommentSubmitted(comment: { content: string, parentId: number | null, userId: string, image?: File | null, textFile?: File | null }) {
    if (this.captchaToken) {
      const formData = new FormData();
      
      formData.append('content', comment.content);
      formData.append('parentId', comment.parentId ? comment.parentId.toString() : '');
      formData.append('userId', comment.userId);
      formData.append('captchaToken', this.captchaToken);
  
      if (comment.image) {
        formData.append('image', comment.image);
      }
  
      if (comment.textFile) {
        formData.append('textFile', comment.textFile);
      }

      this.store.dispatch(new CommentsActions.AddComment(formData, this.page, this.pageSize, this.sortCriteria, this.sortOrder, this.captchaToken));
    } else {
      alert("Please complete the CAPTCHA verification.");
    }
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

  onSortChange() {
    this.loadComments();
  }

  onCaptchaResolved(token: string | null) {
    if (token) {
      this.captchaToken = token;
      this.isCaptchaVerified = true; 
    } else {
      this.captchaToken = '';
      this.isCaptchaVerified = false; 
    }
  }
}
