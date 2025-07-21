import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ResponseDto } from '../interfaces/responseDto';

@Injectable()
export class AuthService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('AuthService');

  constructor(private jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting from database:', error);
    }
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<ResponseDto<JwtResponseDto>> {
    try {
      const { username, email, password } = registerUserDto;

      // Check if user already exists
      const existingUser = await this.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        throw new RpcException(
          'User with this username or email already exists',
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      Logger.log('Paso por register');
      // Create user
      const user = await this.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          status: true,
          created_at: true,
        },
      });

      // Assign default role (if exists)
      try {
        const defaultRole = await this.role.findFirst({
          where: { name: 'user' },
        });

        if (defaultRole) {
          await this.userRole.create({
            data: {
              user_id: user.user_id,
              role_id: defaultRole.role_id,
            },
          });
        }
      } catch (error) {
        this.logger.warn(
          'Default role not found or error assigning role:',
          error,
        );
      }

      // Generate JWT tokens
      const tokens = await this.generateTokens(
        user.user_id,
        user.username,
        user.email,
        ['user'],
      );

      // Save session
      await this.saveUserSession(
        user.user_id,
        tokens.access_token,
        tokens.refresh_token,
      );

      const response: JwtResponseDto = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: 3600, // 1 hour
        token_type: 'Bearer',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          roles: ['user'],
        },
      };

      return {
        message: 'User registered successfully',
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.logger.error('Error registering user:', error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(`Registration failed: ${error.message}`);
    }
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<ResponseDto<JwtResponseDto>> {
    try {
      const { username, password } = loginUserDto;

      // Find user with roles
      const user = await this.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username }, // Allow login with email
          ],
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is active
      if (user.status !== 1) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Extract roles
      const roles = user.roles.map((ur) => ur.role.name);

      // Generate JWT tokens
      const tokens = await this.generateTokens(
        user.user_id,
        user.username,
        user.email,
        roles,
      );

      // Save session
      await this.saveUserSession(
        user.user_id,
        tokens.access_token,
        tokens.refresh_token,
      );

      const response: JwtResponseDto = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: 3600, // 1 hour
        token_type: 'Bearer',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          roles,
        },
      };

      return {
        message: 'Login successful',
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.logger.error('Error logging in user:', error);
      if (error instanceof UnauthorizedException) {
        throw new RpcException(error.message);
      }
      throw new RpcException(`Login failed: ${error.message}`);
    }
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Check if session exists
      const session = await this.userSession.findFirst({
        where: {
          token,
          expires_at: {
            gt: new Date(),
          },
        },
      });

      if (!session) {
        return null;
      }

      return payload;
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      return null;
    }
  }

  async logout(token: string): Promise<ResponseDto<any>> {
    try {
      await this.userSession.deleteMany({
        where: { token },
      });

      return {
        message: 'Logout successful',
        data: null,
        statusCode: 200,
      };
    } catch (error) {
      this.logger.error('Error during logout:', error);
      throw new RpcException(`Logout failed: ${error.message}`);
    }
  }

  private async generateTokens(
    userId: number,
    username: string,
    email: string,
    roles: string[],
  ) {
    const payload: JwtPayload = {
      sub: userId,
      username,
      email,
      roles,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async saveUserSession(
    userId: number,
    token: string,
    refreshToken?: string,
  ) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour from now

    await this.userSession.create({
      data: {
        user_id: userId,
        token,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
    });
  }
}
