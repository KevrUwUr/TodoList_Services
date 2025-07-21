import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsPositive()
  public id: number;
  @IsString()
  public username: string;
  @IsString()
  public email: string;
  @IsString()
  public password: string;
  @IsNumber()
  public team_id: number;
  @IsNumber()
  public status: number;
  @IsNumber()
  public role_id: number;
}
