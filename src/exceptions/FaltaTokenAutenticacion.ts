import HttpException from './HttpExceptions';
class FaltaTokenAutenticacion extends HttpException{
    constructor(){
        super(401, `Falta token de autenticacion`);
    }
}

export default FaltaTokenAutenticacion;