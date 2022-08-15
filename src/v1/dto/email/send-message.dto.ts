import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReservationMessageDto {
  @IsEmail()
  @ApiProperty({
    description: 'mentorEmail',
    required: true,
  })
  mentorEmail: string;

  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'cadetSlackId',
    required: true,
  })
  cadetSlackId: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiProperty({
    description: 'reservationTime1',
    required: true,
    type: [Date],
  })
  reservationTime1: Date[];

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiProperty({
    description: 'reservationTime2',
    required: true,
    type: [Date],
  })
  reservationTime2?: Date[];

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiProperty({
    description: 'reservationTime3',
    required: true,
    type: [Date],
  })
  reservationTime3?: Date[];

  @IsBoolean()
  @ApiProperty({
    description: 'isCommon',
    required: true,
    type: Boolean,
  })
  isCommon: boolean;
}

export class ApproveMessageDto {
  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'mentorSlackId',
    required: true,
  })
  mentorSlackId: string;

  @IsEmail()
  @ApiProperty({
    description: 'cadetEmail',
    required: true,
  })
  cadetEmail: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiProperty({
    description: 'meetingAt',
    required: true,
    type: [Date],
  })
  meetingAt: Date[];
}

export class CancelMessageDto {
  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'mentorSlackId',
    required: true,
  })
  mentorSlackId: string;

  @IsEmail()
  @ApiProperty({
    description: 'cadetEmail',
    required: true,
  })
  cadetEmail: string;

  @IsString()
  @IsOptional()
  rejectMessage: string;
}