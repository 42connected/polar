import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { CreateMentorDto } from 'src/v1/dto/mentors/create-mentor.dto';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';
import { AvailableTimeDto } from 'src/v1/dto/available-time.dto';
import { UpdateMentor } from 'src/v1/interface/mentors/update-mentor.interface';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
  ) {}

  async createUser(user: CreateMentorDto): Promise<JwtUser> {
    try {
      const createdUser: Mentors = this.mentorsRepository.create(user);
      createdUser.isActive = false;
      await this.mentorsRepository.save(createdUser);
      return {
        id: createdUser.id,
        intraId: createdUser.intraId,
        role: 'mentor',
      };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 생성 중 에러가 발생했습니다.',
      );
    }
  }

  async findByIntra(intraId: string): Promise<JwtUser> {
    try {
      const foundUser: Mentors = await this.mentorsRepository.findOneBy({
        intraId,
      });
      return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'mentor' };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }

  async findMentorByIntraId(intraId: string): Promise<Mentors> {
    let mentor: Mentors;
    try {
      mentor = await this.mentorsRepository.findOneBy({
        intraId: intraId,
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 멘토 찾는중 오류가 발생하였습니다',
      );
    }
    if (!mentor) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    return mentor;
  }

  async validateInfo(intraId: string): Promise<boolean> {
    try {
      const mentor: Mentors = await this.findMentorByIntraId(intraId);
      if (mentor.name === null) {
        return false;
      }
      const week: AvailableTimeDto[][] = JSON.parse(mentor.availableTime);
      week.forEach(day => {
        if (day.length > 0) {
          return true;
        }
      });
      return false;
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  async updateMentorDetails(
    intraId: string,
    infos: UpdateMentor,
  ): Promise<void> {
    const { name, email, availableTime, slackId, isActive, markdownContent } =
      infos;
    const foundUser: Mentors = await this.findMentorByIntraId(intraId);
    foundUser.name = name;
    foundUser.email = email;
    foundUser.slackId = slackId;
    foundUser.isActive = isActive;
    foundUser.markdownContent = markdownContent;
    if (isActive) {
      if (!availableTime) {
        throw new BadRequestException(
          '멘토링 가능으로 설정 시 가능시간을 입력해야 합니다.',
        );
      }
      foundUser.availableTime = JSON.stringify(
        this.validateAvailableTime(availableTime),
      );
    }
    try {
      await this.mentorsRepository.save(foundUser);
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  isValidTime(time: AvailableTimeDto): boolean {
    if (
      !(time.startHour >= 0 && time.startHour < 24) ||
      !(time.startMinute === 0 || time.startMinute === 30) ||
      !(time.endHour >= 0 && time.endHour < 24) ||
      !(time.endMinute === 0 || time.endMinute === 30)
    ) {
      return false;
    }
    if (time.startHour >= time.endHour) {
      return false;
    }
    const endTotalMinute = time.endHour * 60 + time.endMinute;
    const startTotalMinute = time.startHour * 60 + time.startMinute;
    if (endTotalMinute - startTotalMinute < 60) {
      return false;
    }
    return true;
  }

  validateTimeOverlap(time1: AvailableTimeDto, time2: AvailableTimeDto) {
    if (time1.startHour <= time2.startHour && time1.endHour > time2.startHour) {
      throw new BadRequestException('시간 사이에 중복이 존재합니다.');
    }
    if (
      time1.endHour === time2.startHour &&
      time1.endMinute === 30 &&
      time2.endMinute === 0
    ) {
      throw new BadRequestException('시간 사이에 중복이 존재합니다.');
    }
    if (time2.startHour <= time1.startHour && time2.endHour > time1.startHour) {
      throw new BadRequestException('시간 사이에 중복이 존재합니다.');
    }
    if (
      time2.endHour === time1.startHour &&
      time2.endMinute === 30 &&
      time1.endMinute === 0
    ) {
      throw new BadRequestException('시간 사이에 중복이 존재합니다.');
    }
  }

  validateAvailableTime(time: AvailableTimeDto[][]): AvailableTimeDto[][] {
    time.forEach(t =>
      t.forEach(tt => {
        if (!this.isValidTime(tt)) {
          throw new BadRequestException('올바르지 않은 시간 형식입니다');
        }
      }),
    );
    for (let day = 0; day < 7; day++) {
      const length = time[day].length;
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
          if (i == j) continue;
          this.validateTimeOverlap(time[day][i], time[day][j]);
        }
      }
    }
    return time;
  }
}
