import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { User } from './entities/user.entity';
import { ResponseDto } from '../interfaces/responseDto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'common';
import { Team } from './entities/team.entity';
import { PaginationMetaDto } from 'common/dto/pagination_meta.dto';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UsersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected successfully');
  }
  async findAllUsersService(
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<User[]>> {
    const { page = 1, limit = 10 } = paginationDto;

    const users = await this.userProfile.findMany({
      include: {
        team: true,
        role: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.userProfile.count();

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      message: 'Users retrieved successfully',
      data: users,
      statusCode: 200,
      meta,
    };
  }

  async findOneUser(id: number): Promise<User> {
    const user = await this.userProfile.findUnique({
      where: { user_id: id },
    });
    if (!user) {
      throw new RpcException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUserService(
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    const { id: user_id, ...updateData } = updateUserDto;

    await this.findOneUser(user_id);

    const updated_user = await this.userProfile.update({
      where: { user_id: user_id },
      data: updateData,
    });
    const response = {
      message: 'User updated successfully',
      data: updated_user,
      statusCode: 200,
    };
    return response;
  }

  async findAllTeamsService(
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<Team[]>> {
    const { page = 1, limit = 10 } = paginationDto;

    const teams = await this.team.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.team.count();

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      message: 'Teams retrieved successfully',
      data: teams,
      statusCode: 200,
      meta,
    };
  }

  async findOneTeam(team_id: number): Promise<Team> {
    const team = await this.team.findUnique({
      where: { team_id: team_id },
    });
    if (!team) {
      throw new RpcException(`Team with ID ${team_id} not found`);
    }
    return team;
  }

  createTeamService(createTeamDto: CreateTeamDto) {
    const create_team = this.team.create({
      data: createTeamDto,
    });
    return create_team;
  }

  async updateTeamService(
    updateTeamDto: UpdateTeamDto,
  ): Promise<ResponseDto<Team>> {
    const { id: team_id, ...updateData } = updateTeamDto;

    await this.findOneTeam(team_id);

    const updated_team = await this.team.update({
      where: { team_id: team_id },
      data: updateData,
    });
    const response = {
      message: 'Team updated successfully',
      data: updated_team,
      statusCode: 200,
    };
    return response;
  }
}
