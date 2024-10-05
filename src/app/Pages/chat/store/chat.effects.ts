import { Injectable } from "@angular/core";
import * as CommentsActions from './chat.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { environment } from "../../../Requests/Options/BaseUrl";
import { apiEnvKey } from "../../../Requests/Options/BaseUrl";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../comment.model";

@Injectable()
export class ChatEffects {
    constructor(private http: HttpClient, private actions$: Actions) {}

    loadRootComments = createEffect(() =>
        this.actions$.pipe(
            ofType(CommentsActions.LOAD_ROOT_COMMENTS),
            switchMap(() => {
                return this.http.get<Comment[]>(`${environment(apiEnvKey)}/api/Comment/GetRootComments`)
                    .pipe(
                        map(comments => new CommentsActions.LoadRootCommentsSuccess(comments)),
                        catchError(error => of(new CommentsActions.LoadRootCommentsFailure(error.message)))
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
                        catchError(error => of(new CommentsActions.LoadCommentTreeFailure(action.commentId, error.message)))
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
                        catchError(error => of(new CommentsActions.AddCommentFailure(error.message)))
                    );
            })
        )
    );
}