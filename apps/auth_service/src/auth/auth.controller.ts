import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'authLogin' })
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern({ cmd: 'authRegister' })
  register(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @MessagePattern({ cmd: 'authValidateToken' })
  validateToken(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }

  @MessagePattern({ cmd: 'authLogout' })
  logout(@Payload() data: { token: string }) {
    return this.authService.logout(data.token);
  }

  @MessagePattern({ cmd: 'authTest' })
  test(@Payload() data: any) {
    return {
      message: 'Auth service is working!',
      data: data,
      timestamp: new Date().toISOString()
    };
  }
}
