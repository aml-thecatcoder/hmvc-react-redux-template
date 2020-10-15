import { validateRoute, validToken } from "../../a-states/route/api";
import {request, get, post, put, one} from '../../a-states/route/actions';
import { createStore, applyMiddleware } from 'redux'
import {logger, crashReporter} from '../../a-states/route/exception';
import routeParameters from '../../a-states/route/reducer';
import { 
    REQUEST_MAKE,
    REQUEST_POST, 
    REQUEST_PUT, 
    REQUEST_GET_ONE 
} from "../../a-states/route/const";

const store = createStore(
    routeParameters,
    applyMiddleware(logger, crashReporter)
)

export function dispatchRoute ({
    route, 
    action, 
    token, 
    middleware, 
    parameters, 
    id, 
    datatype
}) {
    var computedAction = makeRequest(
        route, 
        action, 
        token, 
        middleware, 
        parameters, 
        id, 
        datatype,
    );
    store.dispatch(computedAction);
    // store.unsubscribe();
    return store;
}

function receive(token, parameters, results = null, route) {
    return get(token, parameters, results, route);
}

function makeRequest(route, action, token, middleware, parameters, id, datatype = 'json') {
    if (validateRoute(route, middleware, parameters)) {
        if (validToken(token)) {
            store.subscribe(() => console.log(store.getState()));
            switch(action) {
                case REQUEST_MAKE:
                    store.dispatch(request(token, parameters, route));
                    return receive(token, parameters, [], route);
                case REQUEST_POST:
                    store.dispatch(post(token, parameters, datatype, route));

                    // CREATE ONE API
                    const response = fetch('', {})
                    const results = response.json()
                    return receive(token, parameters, results, route);
                case REQUEST_PUT:
                    store.dispatch(put(token, parameters, datatype, id, route));

                    // UPDATE ONE API
                    const response_1 = fetch('', {})
                    const results_1 = response_1.json()
                    return receive(token, parameters, results_1, route);
                case REQUEST_GET_ONE:
                    store.dispatch(one(token, parameters, id, route));

                    // FETCH ONE API
                    const response_2 = fetch('')
                    const results_2 = response_2.json()
                    return receive(token, parameters, results_2, route);
                default:
                    return receive(token, parameters, [], route);

            }
        }
    }
}