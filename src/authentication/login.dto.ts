import { IsString } from 'class-validator';

class LogInDto {
  @IsString()
  public correo: string;

  @IsString()
  public contrasenia: string;
}

export default LogInDto;
