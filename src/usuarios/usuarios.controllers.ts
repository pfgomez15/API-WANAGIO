import * as express from 'express';
import * as bcrypt from 'bcryptjs';
import Controller from '../interfaces/controller.interface';
import UsuarioI from './usuarios.interface';
import usuarioModelo from './usuarios.model';
import UsuarioNoEncontrado from '../exceptions/UsuarioNoEncontrado';
import validationMiddleware from '../middleware/validation.middleware';
import CrearUsuarioDto from './usuarios.dto';
import RequestConUsuario from '../interfaces/requestConusuario.interface';
import authMiddleware from '../middleware/auth.middleware';


class UsuariosControllers implements Controller{
    
    public path = '/usuarios';
    public router = express.Router();

    private usuario = usuarioModelo;

    constructor(){
        this.initializeRoute();
    }

    private initializeRoute(){
        // this.router.post(this.path, validationMiddleware(CrearUsuarioDto), this.crearUsuario);
        this.router.get(this.path, authMiddleware, this.obtenerUsuarios);
        this.router.get(`${this.path}/:id`, this.obtenerUsuariosId);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CrearUsuarioDto), this.modificarUsuario);
        this.router.delete(`${this.path}/:id`, this.eliminarUsuario);
    }

    // private crearUsuario = async (request: express.Request, response: express.Response) => {
    //     const usuarioData: UsuariosI = request.body;
    //     const contraseniaEncriptada = await bcrypt.hash(usuarioData.contrasenia,10);
    //     const data = await this.usuario.create({
    //         nombres: usuarioData.nombres,
    //         apellidos: usuarioData.apellidos,
    //         correo: usuarioData.correo,
    //         contrasenia: contraseniaEncriptada
    //     });
    //     if(data){
    //         response.status(200).send(data);
    //     }else{
    //         response.status(404).send({message:"Usuario no se registro"});
    //     }
        
    // }

    private obtenerUsuarios = (request: RequestConUsuario, response: express.Response) => {
        const usuariosData = this.usuario.find();
        usuariosData.then((data)=>{response.send(data)});
    }

    private obtenerUsuariosId = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const usuarioData = this.usuario.findById({_id : id});
        usuarioData.then((data) => { 
            if(data){
                response.status(200).send(data)
            }else{
                next(new UsuarioNoEncontrado(id));
            }
        });
    }

    private modificarUsuario = (request: express.Request, response: express.Response) => {
        const id = request.params.id;
        const modificarData : UsuarioI = request.body;
        const dataActualizada = this.usuario.findByIdAndUpdate(id, modificarData, { new: true});
        dataActualizada.then((data) => { response.send(data) });
    }

    private eliminarUsuario = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const eliminarData = this.usuario.findOneAndDelete({_id:id});
        eliminarData.then((data) => {
            if(data){
                response.send(200);
            }else{
                next(new UsuarioNoEncontrado(id));
            }
        });
    }
}

export default UsuariosControllers;