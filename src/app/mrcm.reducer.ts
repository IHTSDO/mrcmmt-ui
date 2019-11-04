import { createReducer, on } from '@ngrx/store';
import { setAttributes } from './mrcm.actions';

export const initialState = 0;

const _counterReducer = createReducer(initialState,
    on(setAttributes, state => state),
);

export function mrcmReducer(state, action) {
    return _counterReducer(state, action);
}
