import { IsNumber } from 'class-validator';

export class CompleteTaskDto {
  @IsNumber()
  userId: number; // ID del usuario que completa la tarea
}
