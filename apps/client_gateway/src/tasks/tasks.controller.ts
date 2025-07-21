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
import { CurrentUser, CurrentUserData } from 'src/auth/decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assigntask.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard) // 🔒 Ver todas las tareas requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('all')
  findAllTasks(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.tasksClient.send({ cmd: 'findAllTasks' }, paginationDto).pipe(
      timeout(10000),
      catchError((err) => {
        Logger.error('Error fetching tasks:', err);
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Crear task requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Post('create')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('sub') userId: number // 👤 Usuario que crea la task
  ) {
    const taskData = {
      ...createTaskDto,
      created_by: userId // Asignar el creador
    };
    return this.tasksClient.send({ cmd: 'createTask' }, taskData).pipe(
      timeout(10000),
      catchError((err) => {
        Logger.error('Error creating task:', err);
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver task específica requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get(':id')
  findOneTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.tasksClient.send({ cmd: 'findOneTask' }, id).pipe(
      timeout(10000),
      catchError((err) => {
        Logger.error('Error finding task:', err);
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Actualizar task requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser('sub') userId: number // 👤 Usuario que actualiza
  ) {
    // Ensure id matches the URL parameter
    const taskData = {
      ...updateTaskDto,
      id: id,
      updated_by: userId // Rastrear quien actualiza
    };

    return this.tasksClient.send({ cmd: 'updateTask' }, taskData).pipe(
      timeout(10000),
      catchError((err) => {
        Logger.error('Error updating task:', err);
        throw new RpcException(err as object);
      }),
    );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Asignar task requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Post(':id/assign')
  assignTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTaskDto: AssignTaskDto,
    @CurrentUser('sub') assignedBy: number // 👤 Quien asigna
  ) {
    const assignData = {
      ...assignTaskDto,
      assigned_by: assignedBy // Rastrear quien asigna
    };
    return this.tasksClient
      .send({ cmd: 'assignTask' }, { id, assignTaskDto: assignData })
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error assigning task:', err);
          throw new RpcException(err as object);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Completar task requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Patch(':id/complete')
  completeTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number // 👤 Usuario que completa
  ) {
    return this.tasksClient
      .send({ cmd: 'completeTask' }, { id, userId })
      .pipe(
        timeout(10000),
        catchError((err) => {
          Logger.error('Error completing task:', err);
          throw new RpcException(err as object);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver tareas de proyecto requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get(':id/project')
  getTasksByProjectController(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.tasksClient
      .send({ cmd: 'getTasksByProject' }, { projectId: id, paginationDto })
      .pipe(
        timeout(10000),
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver historial requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get(':id/history')
  getAllTaskHistoryController(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.tasksClient
      .send({ cmd: 'getAllTaskHistory' }, { id, paginationDto })
      .pipe(
        timeout(10000),
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver mis tareas requiere auth
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('user/my-tasks')
  getMyTasks(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.tasksClient
      .send({ cmd: 'findUserTasks' }, { ...paginationDto, userId: user.sub })
      .pipe(
        timeout(10000),
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(JwtAuthGuard) // 🔒 Ver tareas asignadas a mí
  @UseFilters(new RpcCustomExceptionFilter())
  @Get('user/assigned-to-me')
  getTasksAssignedToMe(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.tasksClient
      .send({ cmd: 'findAssignedTasks' }, { ...paginationDto, userId: user.sub })
      .pipe(
        timeout(10000),
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
