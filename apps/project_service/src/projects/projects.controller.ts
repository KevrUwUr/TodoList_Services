import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JoinMemberDto } from './dto/join-member.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'common';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern('findAllProjects')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.projectsService.findAllProjectsService(paginationDto);
  }

  @MessagePattern('createProject')
  create(@Payload() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProjectService(createProjectDto);
  }

  @MessagePattern('updateProject')
  update(@Payload() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProjectService(updateProjectDto);
  }

  @MessagePattern('findAllProjectMembers')
  findAllProjectMembers(@Payload() projectId: number) {
    return this.projectsService.getAllProjectMembers(projectId);
  }

  @MessagePattern('joinProjectMember')
  joinProjectMember(@Payload() data: { projectId: number; joinMemberDto: JoinMemberDto }) {
    return this.projectsService.joinProjectMember(data.projectId, data.joinMemberDto);
  }
}
