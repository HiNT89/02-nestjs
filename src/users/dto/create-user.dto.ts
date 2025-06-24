import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  description: string;
}
