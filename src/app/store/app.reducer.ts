import { Action, ActionReducer, ActionReducerMap } from '@ngrx/store';
import * as fromComment from '../Pages/chat/store/chat.reducer';

export interface AppState {
    chat: fromComment.State;
}

export const appReducer: ActionReducerMap<AppState, Action> = {
    chat: fromComment.commentReducer as ActionReducer<fromComment.State, Action>,
}