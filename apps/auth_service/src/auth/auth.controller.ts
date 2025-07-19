import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('authLogin')
  create(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('authRegister')
  update(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
