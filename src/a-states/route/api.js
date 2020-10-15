// using methods of getting model-like array from vendor
// setup methods for the states

import { app } from "../../g-vendor/app";

const { throughOrNotThrough } = require("../../g-vendor/route");

export const validateRoute = (name, middleware, parameters) => {
    return throughOrNotThrough(name, middleware, parameters);
} 

export const validToken = (token) => {
    return app('token') === token;
}