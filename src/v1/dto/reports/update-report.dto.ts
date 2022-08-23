import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'place',
    required: false,
  })
  place: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'topic',
    required: false,
  })
  topic: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'content',
    required: false,
  })
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'feedbackMessage',
    required: false,
  })
  feedbackMessage: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback1',
    required: false,
    type: Number,
  })
  feedback1: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback2',
    required: false,
    type: Number,
  })
  feedback2: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback3',
    required: false,
    type: Number,
  })
  feedback3: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'isDone',
    required: false,
    type: Boolean,
  })
  isDone: boolean;
}