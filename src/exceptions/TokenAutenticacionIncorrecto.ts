import HttpException from './HttpExceptions';
class TokenAutenticacionIncorrecto extends HttpException{
    constructor(){
        super(401, `Token de autenticacion incorrecto`);
    }
}

export default TokenAutenticacionIncorrecto;