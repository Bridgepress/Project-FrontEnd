
import { Comment } from "../comment.model";

export const LOAD_ROOT_COMMENTS = '[Comments] Load Root Comments';
export const LOAD_ROOT_COMMENTS_SUCCESS = '[Comments] Load Root Comments Success';
export const LOAD_ROOT_COMMENTS_FAILURE = '[Comments] Load Root Comments Failure';
export const LOAD_COMMENT_TREE = '[Comments] Load Comment Tree';
export const LOAD_COMMENT_TREE_SUCCESS = '[Comments] Load Comment Tree Success';
export const LOAD_COMMENT_TREE_FAILURE = '[Comments] Load Comment Tree Failure';
export const ADD_COMMENT = '[Comments] Add Comment';
export const ADD_COMMENT_SUCCESS = '[Comments] Add Comment Success';
export const ADD_COMMENT_FAILURE = '[Comments] Add Comment Failure';

export class LoadRootComments {
    readonly type = LOAD_ROOT_COMMENTS;
}

export class LoadRootCommentsSuccess {
    readonly type = LOAD_ROOT_COMMENTS_SUCCESS;
    constructor(public comments: Comment[]) {}
}

export class LoadRootCommentsFailure {
    readonly type = LOAD_ROOT_COMMENTS_FAILURE;
    constructor(public error: string) {}
}

export class LoadCommentTree {
    readonly type = LOAD_COMMENT_TREE;
    constructor(public commentId: number) {}
}

export class LoadCommentTreeSuccess {
    readonly type = LOAD_COMMENT_TREE_SUCCESS;
    constructor(public commentId: number, public comments: Comment[]) {}
}

export class LoadCommentTreeFailure {
    readonly type = LOAD_COMMENT_TREE_FAILURE;
    constructor(public commentId: number, public error: string) {}
}

export class AddComment {
    readonly type = ADD_COMMENT;
    constructor(public comment: { content: string, parentId: number | null, userId: string }) {}
}

export class AddCommentSuccess {
    readonly type = ADD_COMMENT_SUCCESS;
    constructor(public comment: Comment) {}
}

export class AddCommentFailure {
    readonly type = ADD_COMMENT_FAILURE;
    constructor(public error: string) {}
}

export type CommentsActions =
    | LoadRootComments
    | LoadRootCommentsSuccess
    | LoadRootCommentsFailure
    | LoadCommentTree
    | LoadCommentTreeSuccess
    | LoadCommentTreeFailure
    | AddComment
    | AddCommentSuccess
    | AddCommentFailure;
