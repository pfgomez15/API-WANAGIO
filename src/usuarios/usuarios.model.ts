import * as mongoose from 'mongoose';
import UsuariosI from './usuarios.interface';

const usuarioSchema = new mongoose.Schema({
    nombres: String,
    apellidos: String,
    correo: String,
    contrasenia: String,
});

const usuariosModel = mongoose.model<UsuariosI & mongoose.Document>('Usuarios', usuarioSchema);
export default usuariosModel;