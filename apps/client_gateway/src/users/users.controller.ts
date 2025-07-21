import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { RpcCustomExceptionFilter } from 'src/common/exceptions/rpc-custom-exception.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from 'src/auth/decorators/current-user.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard) // 🔒 Obtener perfil propio
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('profile')
  getCurrentUserProfile(@CurrentUser() user: CurrentUserData) {
    return {
      message: 'User profile retrieved successfully',
      data: {
        user_id: user.sub,
        username: user.username,
        email: user.email,
        roles: user.roles
      },
      statusCode: 200
    };
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver usuarios requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('all')
  findAllUsers(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.usersClient.send({ cmd: 'findAllUsers' }, paginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Actualizar usuario requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('sub') currentUserId: number // 👤 Usuario actual
  ) {
    // Optional: Verify user can only update their own profile
    // if (id !== currentUserId) {
    //   throw new ForbiddenException('You can only update your own profile');
    // }
    return this.usersClient
      .send({ cmd: 'updateUser' }, { id, ...updateUserDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver equipos requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('teams')
  findAllTeams(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.usersClient.send({ cmd: 'findAllTeams' }, paginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Crear equipo requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Post('teams')
  createTeam(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser('sub') createdBy: number // 👤 Usuario que crea el equipo
  ) {
    const teamData = {
      ...createTeamDto,
      created_by: createdBy // Asignar creador
    };
    return this.usersClient.send({ cmd: 'createTeam' }, teamData).pipe(
      catchError((err) => {
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Actualizar equipo requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Patch('teams/:id')
  updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
    @CurrentUser('sub') updatedBy: number // 👤 Usuario que actualiza
  ) {
    const teamData = {
      ...updateTeamDto,
      updated_by: updatedBy // Rastrear quién actualiza
    };
    return this.usersClient
      .send({ cmd: 'updateTeam' }, { id, ...teamData })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }
}
