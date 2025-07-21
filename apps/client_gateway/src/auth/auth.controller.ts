import {
  Body,
  Controller,
  Post,
  Inject,
  Logger,
  UseFilters,
  Headers,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, timeout } from 'rxjs';
import { RpcCustomExceptionFilter } from 'src/common/exceptions/rpc-custom-exception.filter';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @UseFilters(new RpcCustomExceptionFilter())
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authClient
      .send({ cmd: 'authLogin' }, loginDto)
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error during login:', err);
          throw new RpcException(err);
        }),
      );
  }

  @UseFilters(new RpcCustomExceptionFilter())
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authClient
      .send({ cmd: 'authRegister' }, registerDto)
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error during registration:', err);
          throw new RpcException(err);
        }),
      );
  }

  @UseFilters(new RpcCustomExceptionFilter())
  @Post('validate-token')
  validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new RpcException('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    
    return this.authClient
      .send({ cmd: 'authValidateToken' }, { token })
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error validating token:', err);
          throw new RpcException(err);
        }),
      );
  }

  @UseFilters(new RpcCustomExceptionFilter())
  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new RpcException('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    
    return this.authClient
      .send({ cmd: 'authLogout' }, { token })
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error during logout:', err);
          throw new RpcException(err);
        }),
      );
  }

  @Post('test')
  testConnection() {
    return this.authClient
      .send({ cmd: 'authTest' }, { test: 'Hello from gateway!' })
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error testing connection:', err);
          throw new RpcException(err);
        }),
      );
  }
}
