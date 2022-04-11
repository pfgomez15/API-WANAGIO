import { IsString,IsEmail  } from 'class-validator';
class CrearUsuarioDto{
    
    @IsString()
    public nombres: string;

    @IsString()
    public apellidos: string;

    @IsEmail()
    public correo: string;

    @IsString()
    public contrasenia: string;

}

export default CrearUsuarioDto;