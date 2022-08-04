import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCadetDto } from 'src/v1/dto/cadets/create-cadet.dto';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CadetsService {
  constructor(
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async createUser(user: CreateCadetDto): Promise<jwtUser> {
    const createdUser: Cadets = await this.cadetsRepository.create(user);
    await this.cadetsRepository.save(createdUser);
    return { id: createdUser.id, intraId: createdUser.intraId, role: 'cadet' };
  }

  async findByIntra(intraId: string): Promise<jwtUser> {
    const foundUser: Cadets = await this.cadetsRepository.findOneBy({
      intraId,
    });
    return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'cadet' };
  }

  async getMentoringLogs(id: string): Promise<MentoringLogs[]> {
    const cadet: Cadets = await this.cadetsRepository.findOne({
      where: { id },
      relations: { mentoringLogs: true },
    });
    if (cadet === null) {
      throw new NotFoundException('존재하지 않는 카뎃입니다.');
    }
    return cadet.mentoringLogs;
  }
}
