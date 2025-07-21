import { IsNumber, IsString } from 'class-validator';

export class JoinMemberDto {
  @IsNumber()
  userId: number;

  @IsString()
  role: string;
}
