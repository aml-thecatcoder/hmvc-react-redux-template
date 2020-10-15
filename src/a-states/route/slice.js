import { REQUEST_GET } from "./const"


const initialState = {
    loading: false,
    action: {}
}

export function getRequestResult(state = initialState, action) {
    switch(action.type) {
        case REQUEST_GET:
            return {
                ...state,
                action,
                loading: false
            };
        case !REQUEST_GET:
            return {
                ...state,
                action,
                loading: true
            };
        default:
            return state;
    }
}