import dotenv from 'dotenv';
dotenv.config({path:__dirname + '/src/e-config'});

export const app = (key) => {
    switch(key) {
        case 'token':
            return process.env.APP_TOKEN;
        default:
            return '';
    } 
} 