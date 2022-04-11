import HttpException from './HttpExceptions';
class UsuarioNoEncontrado extends HttpException{
    constructor(id: string){
        super(404, `Usuario con el id ${id} no encontrado`);
    }
}

export default UsuarioNoEncontrado;