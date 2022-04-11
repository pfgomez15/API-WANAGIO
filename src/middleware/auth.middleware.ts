import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import FaltaTokenAutenticacion from '../exceptions/FaltaTokenAutenticacion';
import TokenAutenticacionIncorrecto from '../exceptions/TokenAutenticacionIncorrecto';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestConUsuario from '../interfaces/requestConusuario.interface';
import usuariosModel from '../usuarios/usuarios.model';
import NoAutorizacion from '../exceptions/NoAutorizacion';

async function authMiddleware (request:RequestConUsuario, response:Response,next:NextFunction ){
    const cookies = request.cookies;
    if(cookies && cookies.Authorization){
        const secret = process.env.JWT_SECRET;
        try{
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await usuariosModel.findById(id);
            if(user){
                request.user = user;
                next();
            }else{
                next(new TokenAutenticacionIncorrecto());
            }
        }catch(error){
            next(new TokenAutenticacionIncorrecto());
        }
    }else{
        next(new FaltaTokenAutenticacion());
    }
}

export default authMiddleware;