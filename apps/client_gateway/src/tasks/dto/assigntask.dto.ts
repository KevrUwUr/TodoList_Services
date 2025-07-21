import { IsNumber } from 'class-validator';
export class AssignTaskDto {
  @IsNumber()
  user_id: number; // Reference to User Service
  @IsNumber()
  assigned_by: number; // Reference to User Service
}
