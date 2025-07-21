import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assigntask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @Get('/all')
  @MessagePattern({ cmd: 'findAllTasks' })
  findAllTasksController(@Payload() paginationDto: PaginationDto) {
    return this.tasksService.findAllTasks(paginationDto);
  }

  // @Post()
  @MessagePattern({ cmd: 'createTask' })
  createTaskController(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'findOneTask' })
  findOneTaskController(@Payload() id: number) {
    return this.tasksService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'updateTask' })
  updateTaskController(@Payload() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(updateTaskDto.id, updateTaskDto);
  }

  // @Post(':id/assign')
  @MessagePattern({ cmd: 'assignTask' })
  assignTaskController(
    @Payload() data: { id: number; assignTaskDto: AssignTaskDto },
  ) {
    return this.tasksService.assignTask(data.id, data.assignTaskDto);
  }

  // @Patch(':id/complete')
  @MessagePattern({ cmd: 'completeTask' })
  completeTaskController(@Payload() data: { id: number; userId: number }) {
    return this.tasksService.completeTask(data.id, data.userId);
  }

  // @Get(':id/tasks')
  @MessagePattern({ cmd: 'getTasksByProject' })
  getTasksByProjectController(
    @Payload() data: { projectId: number; paginationDto: PaginationDto },
  ) {
    return this.tasksService.getAllTasksByProjectId(
      data.projectId,
      data.paginationDto,
    );
  }

  // @Get(':id/history')
  @MessagePattern({ cmd: 'getAllTaskHistory' })
  getAllTaskHistoryController(
    @Payload() data: { id: number; paginationDto: PaginationDto },
  ) {
    return this.tasksService.getAllTaskHistory(data.id, data.paginationDto);
  }
}
