import { Request } from 'express';
import Usuario from '../usuarios/usuarios.interface';
 
interface RequestConUsuario extends Request {
  user: Usuario;
}
 
export default RequestConUsuario;