import * as bcrypt from 'bcryptjs';
import {Request, Response, NextFunction, Router} from 'express';
import * as jwt from 'jsonwebtoken';
import TokenAutenticacionIncorrecto from '../exceptions/TokenAutenticacionIncorrecto';
import Controller from '../interfaces/controller.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CrearUsuarioDto from '../usuarios/usuarios.dto';
import usuariosModel from '../usuarios/usuarios.model';
import AuthService from './authentication.service';
import UsuarioI from '../usuarios/usuarios.interface';
import LogInDto from './login.dto';

class AuthenticationController implements Controller{
    public path = '/auth';
    public router = Router();
    public authService = new AuthService();
    private usuario = usuariosModel;

    constructor(){
        this.initializeRoutes();
    };

    private initializeRoutes(){
        this.router.post(`${this.path}/registrar`, validationMiddleware(CrearUsuarioDto, true), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);

    }

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: UsuarioI = request.body;
        try {
          const {
            cookie,
            resgistrarUsuario,
          } = await this.authService.registrarUsuario(userData);
          response.setHeader('Set-Cookie', [cookie]);
          response.send({usuaruio:resgistrarUsuario,token:request.cookies});
        } catch (error) {
          next(error);
        }
      }
    
      private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
        const logInData: LogInDto = request.body;
        const user = await this.usuario.findOne({ correo: logInData.correo });
        if (user) {
          const isPasswordMatching = await bcrypt.compare(
            logInData.contrasenia,
            user.get('contrasenia', null, { getters: false }),
          );
          if (isPasswordMatching) {
            const tokenData = this.createToken(user);
            response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            response.send({usuario:user, token:request.cookies});
          } else {
            next(new TokenAutenticacionIncorrecto());
          }
        } else {
          next(new TokenAutenticacionIncorrecto());
        }
      }
    
      private loggingOut = (request: Request, response: Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
      }
    
      private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}`;
      }
    
      private createToken(user: UsuarioI): TokenData {
        const expiresIn = 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
          _id: user._id,
        };
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
      }
}

export default AuthenticationController; 