// receives route name
// checks file exists
// communicate loader state and instructions (local or not local, cached or not cached)
// return array with state

const fs = require('fs');

export const pathExists = name => {
    // return fs.existsSync(name + '.js');
    return true;
}

export const routeParamsAreArray = parameters => {
    return parameters instanceof Array;
}

export const throughOrNotThrough = (name, middleware, parameters) => {
    if (!pathExists(name)) {
        return [];
    }
    // check middleware
    // check parameters

    if (!routeParamsAreArray()) {
        return [];
    }

    return [name, middleware, parameters];
}