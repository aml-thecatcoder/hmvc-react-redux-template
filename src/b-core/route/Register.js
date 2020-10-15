import { dispatchRoute } from "./Common";
import dotenv from 'dotenv';
dotenv.config({path:__dirname + '/src/e-config'});

export const routes = {
    // register here
    'home': { 
        route: __dirname + '/src/f-views/Home',
        action: 'GET', 
        token: process.env.APP_TOKEN, 
        middleware: 'web|user', 
        parameters: null, 
        id: null, 
        datatype: null
    },
    'about': { 
        route: __dirname + '/src/f-views/About',
        action: 'GET', 
        token: process.env.APP_TOKEN, 
        middleware: 'web|user', 
        parameters: null, 
        id: null, 
        datatype: null
    }
};

export const goto = (routeName) => {
    return dispatchRoute(routes[routeName]);
}