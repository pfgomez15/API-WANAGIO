import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import EmailExiste from '../exceptions/EmailExiste';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import UsuarioI from '../usuarios/usuarios.interface';
import CrearUsuarioDto from '../usuarios/usuarios.dto';
import usuariosModel from '../usuarios/usuarios.model';

class AuthService{
    public usuario = usuariosModel;

    public async registrarUsuario(usuarioData:UsuarioI){
        if(await this.usuario.findOne({correo:usuarioData.correo})){
            throw new EmailExiste(usuarioData.correo);
        }

        const hashedPassword = await bcrypt.hash(usuarioData.contrasenia, 10);

        const resgistrarUsuario = await this.usuario.create({
            ...usuarioData,
            contrasenia: hashedPassword,
        });

        const tokenData = this.createToken(resgistrarUsuario);
        const cookie = this.createCookie(tokenData);
        return {cookie, resgistrarUsuario};
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}`;
    }
    public createToken(user: UsuarioI): TokenData {
        const expiresIn = 60 ; // an hour
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

export default AuthService;
