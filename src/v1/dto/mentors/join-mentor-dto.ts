import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AvailableTimeDto } from '../available-time.dto';

export class JoinMentorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    required: true,
    type: String,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email',
    required: true,
    type: String,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'availableTime',
    required: true,
    type: [[AvailableTimeDto]],
  })
  availableTime: AvailableTimeDto[][];
}
