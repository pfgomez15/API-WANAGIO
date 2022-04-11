import HttpException from './HttpExceptions';
class NoAutorizacion extends HttpException{
    constructor(){
        super(403, `No tienes autorizacion `);
    }
}

export default NoAutorizacion;