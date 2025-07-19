import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  login(loginUserDto: LoginUserDto) {
    return 'This action logs in a user with username: ' + loginUserDto.username;
  }

  register(registerUserDto: RegisterUserDto) {
    return (
      'This action registers a new user with username: ' +
      registerUserDto.username +
      ' and email: ' +
      registerUserDto.email +
      ' and password: ' +
      registerUserDto.password
    );
  }
}
