import App from './app';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import UsuariosControllers from './usuarios/usuarios.controllers';
import AuthenticationController from './authentication/authentication.controller';
validateEnv();

const app = new App(
    [
        new AuthenticationController(),
        new UsuariosControllers(),
    ],
);
app.listen();