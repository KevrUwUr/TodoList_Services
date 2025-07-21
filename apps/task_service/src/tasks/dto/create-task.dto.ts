import { IsString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  status: string; // pending, in_progress, completed, cancelled
  @IsString()
  priority: string; // low, medium, high, urgent
  @IsString()
  due_date?: Date;
  @IsNumber()
  created_by: number; // Reference to User Service
  @IsNumber()
  project_id: number; // Reference to Project Service
}
