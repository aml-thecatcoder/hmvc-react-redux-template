import React, { Component, lazy, Suspense } from 'react'

import {
    Switch,
    Route,
} from "react-router-dom";
import { routes } from './b-core/route/Register'

export default class RouteList extends Component {
    render() {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    {Object.keys(routes).map(name => {
                        return <Route key={name} path={'/' + name} component={lazy(() => import(routes[name].route.replace('//src', '.') + '.js'))}></Route>
                    })}
                </Switch>
            </Suspense>
        )
    }
}
