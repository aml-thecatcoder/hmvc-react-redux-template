I. ACTIONS

- are payloads of information that send data from  your application to the store
- are only source of information for the store
- are sent to the store using store.dispatch()
- are plain javascript objects
- must have a type
- may have error, payload, or meta property

- type: a string constant identifies an action 
- payload: optional + any type of value + information about the action + status of the action
- error: boolean + true if there is an error + payload turns into an error object
- meta: extra information that is not part of the payload

Example:

const ADD_TODO = 'ADD_TODO';
{
    type: ADD_TODO,
    text: 'Build my first Redux app'
}

II. ACTIONS CREATORS

- return an action (ACTIONS defined above)

Example:

function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}

dispatch(addTodo(text))

const boundAddTodo = text => dispatch(addTodo(text))


III. REDUCERS

- specify how the application's state changes in response to actions sent to the store

1. Designing the State Shape

- A state must not be mutate

Example: 

{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}

2. Handling actions

The donts:

- Mutate its arguments
- Perform side effects like API calls and routing transitions
- Call non-pure functions, e.g. Date.now() or Math.random()

The does:

- Calculation for the new state without mutating
- Return the previous state in the default case for unknown action

Example: 

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ]
        case TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo
            })
        default:
            return state
    }
}

// REGULAR //

function todoApp(state = initialState, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        case ADD_TODO:
            return Object.assign({}, state, {
                todos: todos(state.todos, action)
            })
        case TOGGLE_TODO:
            return Object.assign({}, state, {
                todos: todos(state.todos, action)
            })
        default:
            return state
    }
}

// BETTER

function todoApp(state = {}, action) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
    }
}

// BEST // 

const todoApp = combineReducers({
    visibilityFilter,
    todos
})

export default todoApp

III. STORE

- Pass arguments to the reducers
- Holds application state
- Allows access to state via getState()
- Allows state to be updated via dispatch(action)
- Registers listeners via subscribe(listener)
- Handles unregistering of listeners via the function returned by subscribe(listener)

Example: 

import { createStore } from 'redux'
import todoApp from './reducers'

const store = createStore(todoApp) 
- call both reducers from todoApp
- return what is inside exported combineReducers method => new state of our app
- may use listener to get the latest state

IV. ASYNC ACTIONS

1. Actions
- informs the reducers that the request began
    + The reducers may handle this action by toggling an isFetching flag in the state. This way the UI knows it's time to show a spinner
- informs the reducers that the request finished successfully
    + The reducers may handle this action by merging the new data into the state they manage and resetting isFetching. The UI would hide the spinner, and display the fetched data.
- informs the reducers that the request failed
    + The reducers may handle this action by resetting isFetching. Additionally, some reducers may want to store the error message so the UI can display it

2. Synchronous Action Creators

- use with redux thunk

Example:

import fetch from 'cross-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

function requestPosts(subreddit) {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
}
function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}
export function invalidateSubreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchPosts(subreddit) {
    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.

    return function (dispatch) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.

        dispatch(requestPosts(subreddit))

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.

        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(
            response => response.json()
            // Do not use catch, because errors occured during rendering
            // should be handled by React Error Boundaries
            // https://reactjs.org/docs/error-boundaries.html
        )
        .then(json =>
            // We can dispatch many times!
            // Here, we update the app state with the results of the API call.

            dispatch(receivePosts(subreddit, json))
        )
    }
}

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPosts } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    )
)

store.dispatch(selectSubreddit('reactjs'))
store.dispatch(fetchPosts('reactjs')).then(() => console.log(store.getState()))


3. Middleware deep dive

- Logger and Crash report before dispatching

Example 1:

import { createStore, combineReducers, applyMiddleware } from 'redux'

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        Raven.captureException(err, {
            extra: {
                action,
                state: store.getState()
            }
        })
        throw err
    }
}

const todoApp = combineReducers(reducers)
const store = createStore(
    todoApp,
    // applyMiddleware() tells createStore() how to handle middleware
    applyMiddleware(logger, crashReporter)
)

store.dispatch(addTodo('Use Redux'))


Example 2:

- Manipulating queued action

<!-- /**
 * Logs all actions and states after they are dispatched.
 */ -->
const logger = store => next => action => {
    console.group(action.type)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
    return result
}

<!-- /**
 * Sends crash reports as state is updated and listeners are notified.
 */ -->
const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        Raven.captureException(err, {
            extra: {
                action,
                state: store.getState()
            }
        })
        throw err
    }
}
<!-- 
/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 */ -->
const timeoutScheduler = store => next => action => {
    if (!action.meta || !action.meta.delay) {
        return next(action)
    }

    const timeoutId = setTimeout(() => next(action), action.meta.delay)

    return function cancel() {
        clearTimeout(timeoutId)
    }
}
<!-- 
/**
 * Schedules actions with { meta: { raf: true } } to be dispatched inside a rAF loop
 * frame.  Makes `dispatch` return a function to remove the action from the queue in
 * this case.
 */ -->
    const rafScheduler = store => next => {
    const queuedActions = []
    let frame = null

    function loop() {
        frame = null
        try {
            if (queuedActions.length) {
                next(queuedActions.shift())
            }
        } finally {
            maybeRaf()
        }
    }

    function maybeRaf() {
        if (queuedActions.length && !frame) {
            frame = requestAnimationFrame(loop)
        }
    }

    return action => {
        if (!action.meta || !action.meta.raf) {
            return next(action)
        }

        queuedActions.push(action)
        maybeRaf()

        return function cancel() {
            queuedActions = queuedActions.filter(a => a !== action)
        }
    }
}

<!-- /**
 * Lets you dispatch promises in addition to actions.
 * If the promise is resolved, its result will be dispatched as an action.
 * The promise is returned from `dispatch` so the caller may handle rejection.
 */ -->
const vanillaPromise = store => next => action => {
    if (typeof action.then !== 'function') {
        return next(action)
    }

    return Promise.resolve(action).then(store.dispatch)
}

<!-- /**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */ -->
const readyStatePromise = store => next => action => {
    if (!action.promise) {
        return next(action)
    }

    function makeAction(ready, data) {
        const newAction = Object.assign({}, action, { ready }, data)
        delete newAction.promise
        return newAction
    }

    next(makeAction(false))
    return action.promise.then(
        result => next(makeAction(true, { result })),
        error => next(makeAction(true, { error }))
    )
}

<!-- /**
 * Lets you dispatch a function instead of an action.
 * This function will receive `dispatch` and `getState` as arguments.
 *
 * Useful for early exits (conditions over `getState()`), as well
 * as for async control flow (it can `dispatch()` something else).
 *
 * `dispatch` will return the return value of the dispatched function.
 */ -->
const thunk = store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action)

// You can use all of them! (It doesn't mean you should.)
const todoApp = combineReducers(reducers)
const store = createStore(
    todoApp,
    applyMiddleware(
        rafScheduler,
        timeoutScheduler,
        thunk,
        vanillaPromise,
        readyStatePromise,
        logger,
        crashReporter
    )
)















