import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, timeout } from 'rxjs';
import { PaginationDto } from 'src/common';
import { RpcCustomExceptionFilter } from 'src/common/exceptions/rpc-custom-exception.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from 'src/auth/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JoinMemberDto } from './dto/join-member.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject('PROJECTS_SERVICE') private readonly projectsClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard) // 🔒 Requiere autenticación
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('all')
  findAllProjects(@Query() paginationDto: PaginationDto) {
    // Agregar el created_by del usuario autenticado
    return this.projectsClient.send('findAllProjects', paginationDto).pipe(
      catchError((err) => {
        Logger.error('Error fetching projects:', err);
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Requiere autenticación
  @UseFilters(new RpcCustomExceptionFilter())
  @Post('create')
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: CurrentUserData, // 👤 Usuario actual
  ) {
    // Agregar el created_by del usuario autenticado
    const projectData = {
      ...createProjectDto,
      created_by: user.sub, // user_id del token JWT
    };
    return this.projectsClient.send('createProject', projectData).pipe(
      timeout(10000),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Actualizar proyecto requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Patch(':id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: CurrentUserData, // 👤 Usuario que actualiza
  ) {
    const projectData = {
      ...updateProjectDto,
      updated_by: user.sub, // Rastrear quien actualiza
    };

    return this.projectsClient
      .send('updateProject', { id, ...projectData })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver miembros requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get(':projectId/members')
  findProjectMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: CurrentUserData, // 👤 Usuario actual
  ) {
    return this.projectsClient.send('findAllProjectMembers', projectId).pipe(
      timeout(10000),
      catchError((err) => {
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Solo usuarios autenticados pueden unirse
  @UseFilters(new RpcCustomExceptionFilter())
  @Post(':projectId/join')
  joinProjectMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() joinMemberDto: JoinMemberDto,
    @CurrentUser() user: CurrentUserData, // 👤 Usuario actual
  ) {
    const memberData = {
      ...joinMemberDto,
      projectId: projectId,
      userId: user.sub, // Usar el userId del token
    };

    return this.projectsClient
      .send('joinProjectMember', { projectId, joinMemberDto: memberData })
      .pipe(
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver proyecto específico requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get(':id')
  findOneProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.projectsClient.send('findOneProject', id).pipe(
      timeout(10000),
      catchError((err) => {
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver mis proyectos requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('user/my-projects')
  getMyProjects(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.projectsClient
      .send('findUserProjects', { ...paginationDto, userId: user.sub })
      .pipe(
        timeout(10000),
        catchError((err) => {
          throw new RpcException(err as object);
        }),
      );
  }
}
