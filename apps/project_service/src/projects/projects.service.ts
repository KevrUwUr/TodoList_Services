/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment*/
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { ResponseDto } from '../interfaces/responseDto';
import { Project } from './entities/project.entity';
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from 'common';
import { PaginationMetaDto } from 'common/dto/pagination_meta.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMember } from './entities/projectMember.entity';
import { JoinMemberDto } from './dto/join-member.dto';

@Injectable()
export class ProjectsService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('ProjectsService');

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
  async findAllProjectsService(
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<Project[]>> {
    const { page = 1, limit = 10 } = paginationDto;

    const projects = await this.project.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.project.count();

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      message: 'Projects retrieved successfully',
      data: projects,
      statusCode: 200,
      meta,
    };
  }

  async findOneProject(id: number): Promise<Project> {
    const project = await this.project.findUnique({
      where: { project_id: id },
    });
    if (!project) {
      throw new RpcException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async createProjectService(
    createProjectDto: CreateProjectDto,
  ): Promise<ResponseDto<Project>> {
    const new_project = await this.project.create({
      data: createProjectDto,
    });
    const response = {
      message: 'Project created successfully',
      data: new_project,
      statusCode: 201,
    };
    return response;
  }
  async updateProjectService(
    updateProjectDto: UpdateProjectDto,
  ): Promise<ResponseDto<Project>> {
    const { id: project_id, ...updateData } = updateProjectDto;

    await this.findOneProject(project_id);

    const updated_project = await this.project.update({
      where: { project_id: project_id },
      data: updateData,
    });
    const response = {
      message: 'Project updated successfully',
      data: updated_project,
      statusCode: 200,
    };
    return response;
  }

  async getAllProjectMembers(projectId: number): Promise<ResponseDto<any[]>> {
    const projectMembers = await this.projectMember.findMany({
      where: { project_id: projectId },
      include: {
        project: true,
      },
    });

    return {
      message: 'Project members retrieved successfully',
      data: projectMembers,
      statusCode: 200,
    };
  }

  async joinProjectMember(
    projectId: number,
    joinMemberDto: JoinMemberDto,
  ): Promise<ResponseDto<ProjectMember>> {
    const project = await this.findOneProject(projectId);
    if (!project) {
      throw new RpcException(`Project with ID ${projectId} not found`);
    }
    const userId = joinMemberDto.userId;
    const existingMember = await this.projectMember.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });

    if (existingMember) {
      throw new RpcException(
        `User with ID ${userId} is already a member of this project`,
      );
    }

    const projectMember = await this.projectMember.create({
      data: {
        project_id: projectId,
        user_id: userId,
        role: joinMemberDto.role,
      },
    });

    return {
      message: 'User added to project successfully',
      data: projectMember,
      statusCode: 201,
    };
  }
}
