import HttpException from './HttpExceptions';
class EmailExiste extends HttpException{
    constructor(email: string){
        super(400, `Usuario con el email ${email} ya esta registrado`);
    }
}

export default EmailExiste;