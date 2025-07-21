import { IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public end_date: Date;
  @IsNumber()
  public status: number; // 1 for active, 0 for inactive

  @IsNumber()
  public team_id: number;
}
