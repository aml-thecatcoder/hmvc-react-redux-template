import { 
    REQUEST_MAKE, 
    REQUEST_GET, 
    REQUEST_POST, 
    REQUEST_PUT, 
    REQUEST_GET_ONE 
} from "./const"

export function request(token, parameters, route) {
    return {
        type: REQUEST_MAKE,
        payload: [token, parameters],
        error: false,
        loading: true,
        route
    }
}
export function get(token, parameters, results = [], route) {
    return {
        type: REQUEST_GET,
        payload: [token, parameters],
        error: false,
        meta: results,
        loading: false,
        route
    }
}
export function post(token, parameters, datatype, route) {
    return {
        type: REQUEST_POST,
        payload: [token, parameters],
        error: false,
        meta: datatype,
        loading: true,
        route
    }
}
export function put(token, parameters, datatype, index, route) {
    return {
        type: REQUEST_PUT,
        payload: [token, parameters],
        error: false,
        meta: datatype,
        index,
        loading: true,
        route
    }
}
export function one(token, parameters, index, route) {
    return {
        type: REQUEST_GET_ONE,
        payload: [token, parameters],
        error: false,
        index,
        loading: true,
        route
    }
}