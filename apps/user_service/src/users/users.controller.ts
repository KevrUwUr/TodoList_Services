import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/all')
  @MessagePattern({ cmd: 'findAllUsers' })
  findAllUsersController(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAllUsersService(paginationDto);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'updateUser' })
  updateUserController(@Payload() updateUserDto: UpdateUserDto) {
    console.log('Update User DTO:', updateUserDto);
    const response = this.usersService.updateUserService(updateUserDto);
    return response;
  }

  // @Get('teams')
  @MessagePattern({ cmd: 'findAllTeams' })
  findAllTeamsController(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAllTeamsService(paginationDto);
  }

  // @Post('teams')
  @MessagePattern({ cmd: 'createTeam' })
  createUserController(@Payload() createTeamDto: CreateTeamDto) {
    const response = this.usersService.createTeamService(createTeamDto);
    return response;
  }

  // @Patch('teams/:id')
  @MessagePattern({ cmd: 'updateTeam' })
  update(@Payload() updateTeamDto: UpdateTeamDto) {
    const response = this.usersService.updateTeamService(updateTeamDto);
    return response;
  }
}
