import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { ResponseDto } from 'interfaces/responseDto';
import { Task } from './entities/task.entity';
import { PaginationDto } from 'common';
import { PaginationMetaDto } from 'common/dto/pagination_meta.dto';
import { AssignTaskDto } from './dto/assigntask.dto';

@Injectable()
export class TasksService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('TasksService');

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

  async findAllTasks(
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<Task[]>> {
    const { page = 1, limit = 10 } = paginationDto;

    const tasks = await this.task.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.task.count();

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      message: 'Tasks retrieved successfully',
      data: tasks,
      statusCode: 200,
      meta,
    };
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.task.create({
      data: {
        ...createTaskDto,
        project_id: createTaskDto.project_id,
      },
    });

    return {
      message: 'Task created successfully',
      data: task,
      statusCode: 201,
    };
  }
  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseDto<Task>> {
    try {
      // First check if task exists
      const existingTask = await this.task.findUnique({
        where: { task_id: id },
      });

      if (!existingTask) {
        throw new RpcException(`Task with ID ${id} not found`);
      }

      // Remove the id from updateTaskDto to avoid conflicts
      const { id: taskId, ...updateData } = updateTaskDto;

      const task = await this.task.update({
        where: { task_id: id },
        data: updateData,
      });

      return {
        message: 'Task updated successfully',
        data: task,
        statusCode: 200,
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(id: number) {
    const task = await this.task.findUnique({
      where: { task_id: id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return {
      message: 'Task retrieved successfully',
      data: task,
      statusCode: 200,
    };
  }

  async assignTask(id: number, assignTaskDto: AssignTaskDto) {
    const task = await this.taskAssignment.create({
      data: {
        task_id: id,
        user_id: assignTaskDto.user_id,
        assigned_by: assignTaskDto.assigned_by,
      },
    });

    await this.taskHistory.create({
      data: {
        task_id: id,
        action: 'assigned',
        changed_by: assignTaskDto.user_id,
      },
    });

    return {
      message: 'Task assigned successfully',
      data: task,
      statusCode: 201,
    };
  }

  async completeTask(id: number, userId: number) {
    const task = await this.task.update({
      where: { task_id: id },
      data: { status: 'completed' },
    });

    await this.taskHistory.create({
      data: {
        task_id: id,
        action: 'completed',
        changed_by: userId,
      },
    });

    return {
      message: 'Task completed successfully',
      data: task,
      statusCode: 200,
    };
  }

  async getAllTasksByProjectId(
    projectId: number,
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<Task[]>> {
    const { page = 1, limit = 10 } = paginationDto;
    const tasks = await this.task.findMany({
      where: { project_id: projectId },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.task.count({
      where: { project_id: projectId },
    });

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      message: 'Tasks retrieved successfully',
      data: tasks,
      statusCode: 200,
      meta,
    };
  }

  async getAllTaskHistory(
    id: number,
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<any[]>> {
    const { page = 1, limit = 10 } = paginationDto;

    const history = await this.taskHistory.findMany({
      where: { task_id: id },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!history || history.length === 0) {
      throw new RpcException(`No history found for task with ID ${id}`);
    }

    const total = await this.taskHistory.count({
      where: { task_id: id },
    });

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      message: 'Task history retrieved successfully',
      data: history,
      statusCode: 200,
      meta,
    };
  }
}
