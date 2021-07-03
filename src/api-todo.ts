import * as cors from 'cors';
import * as bodyParser from 'body-parser';


import loggerMiddleware from './middleware/logger';


import App from './app'
import { HTTP_SERVER_PORT } from './global/environment';
import AuthUsuario from './controllers/auth/auth-usuario';
import { verificaTokenUsuario } from './middleware/autenticacion';
import TodoTask from './controllers/todo/todo';



const app = new App({
    port: HTTP_SERVER_PORT,
    controllers: [
        new AuthUsuario(),
        new TodoTask(),
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware,
        cors({ origin: true, credentials: true }),
    ]
})

app.listen();
