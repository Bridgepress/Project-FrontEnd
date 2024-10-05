import { Action } from '@ngrx/store';
import * as CommentsActions from './chat.actions';
import { Comment } from '../comment.model';

export interface State {
    comments: Comment[];
    loading: boolean;
    error: string | null;
    expandedComments: { [key: number]: Comment[] };
}

export const initialState: State = {
    comments: [],
    loading: false,
    error: null,
    expandedComments: {}
};

export function commentReducer(state: State = initialState, action: CommentsActions.CommentsActions | Action): State {
    switch (action.type) {
        case CommentsActions.LOAD_ROOT_COMMENTS:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CommentsActions.LOAD_ROOT_COMMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                comments: (action as CommentsActions.LoadRootCommentsSuccess).comments
            };
        case CommentsActions.LOAD_ROOT_COMMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: (action as CommentsActions.LoadRootCommentsFailure).error
            };
        case CommentsActions.LOAD_COMMENT_TREE:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CommentsActions.LOAD_COMMENT_TREE_SUCCESS:
            const loadTreeAction = action as CommentsActions.LoadCommentTreeSuccess;
            return {
                ...state,
                loading: false,
                expandedComments: {
                    ...state.expandedComments,
                    [loadTreeAction.commentId]: loadTreeAction.comments
                }
            };
        case CommentsActions.LOAD_COMMENT_TREE_FAILURE:
            return {
                ...state,
                loading: false,
                error: (action as CommentsActions.LoadCommentTreeFailure).error
            };
        case CommentsActions.ADD_COMMENT:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CommentsActions.ADD_COMMENT_SUCCESS:
            const newComment = (action as CommentsActions.AddCommentSuccess).comment;
            const parentId = newComment.parentId;
            if (parentId && state.expandedComments[parentId]) {
                return {
                    ...state,
                    loading: false,
                    expandedComments: {
                        ...state.expandedComments,
                        [parentId]: [...state.expandedComments[parentId], newComment]
                    }
                };
            }
            return {
                ...state,
                loading: false,
                comments: [...state.comments, newComment]
            };
        case CommentsActions.ADD_COMMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: (action as CommentsActions.AddCommentFailure).error
            };
        default:
            return state;
    }
}