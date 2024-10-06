import { Injectable } from "@angular/core";
import * as CommentsActions from './chat.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { environment } from "../../../Requests/Options/BaseUrl";
import { apiEnvKey } from "../../../Requests/Options/BaseUrl";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../comment.model";
import { Store } from "@ngrx/store";
import * as fromApp from '../../../store/app.reducer';
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ChatEffects {
    constructor(private http: HttpClient, private actions$: Actions, private store: Store<fromApp.AppState>, private toastr: ToastrService) {}

    loadRootComments = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.LOAD_ROOT_COMMENTS),
            switchMap((action: CommentsActions.LoadRootComments) => {
                return this.http.get<{ items: Comment[], totalItems: number }>(
                    `${environment(apiEnvKey)}/api/Comment/GetRootComments?page=${action.page}&pageSize=${action.pageSize}&sortBy=${action.sortCriteria}&sortOrder=${action.sortOrder}`
                ).pipe(
                    map(response => new CommentsActions.LoadRootCommentsSuccess(response.items, response.totalItems)),
                    catchError(error => {
                        this.toastr.error('Failed to load comments', error.message);
                        return of(new CommentsActions.LoadRootCommentsFailure(error.message));
                    })
                );
            })
        )
    );

    loadCommentTree = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.LOAD_COMMENT_TREE),
            switchMap((action: CommentsActions.LoadCommentTree) => {
                return this.http.get<Comment[]>(`${environment(apiEnvKey)}/api/Comment/GetCommentTree/${action.commentId}`)
                    .pipe(
                        map(comments => new CommentsActions.LoadCommentTreeSuccess(action.commentId, comments)),
                        catchError(error => {
                            this.toastr.error('Failed to load comment tree', error.message);
                            return of(new CommentsActions.LoadCommentTreeFailure(action.commentId, error.message));
                        })
                    );
            })
        )
    );

    addComment = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.ADD_COMMENT),
            switchMap((action: CommentsActions.AddComment) => {
                return this.http.post<Comment>(`${environment(apiEnvKey)}/api/Comment/AddComment`, action.comment)
                    .pipe(
                        map(comment => new CommentsActions.AddCommentSuccess(comment)),
                        switchMap((comment) => {
                            return [new CommentsActions.LoadRootComments(action.page, action.pageSize, action.sortCriteria, action.sortOrder)];
                        }),
                        catchError(error => {
                            this.toastr.error('Failed to load comment tree', error.message);
                            return of(new CommentsActions.AddCommentFailure(error.message))
                        })                       
                    );
            })
        )
    );
}