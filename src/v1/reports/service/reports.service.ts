import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from 'src/v1/dto/reports/create-report.dto';
import { ReportsSortDto } from 'src/v1/dto/reports/reports-sort.dto';
import { UpdateReportDto } from 'src/v1/dto/reports/update-report.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Reports } from 'src/v1/entities/reports.entity';
import { DataSource, Repository } from 'typeorm';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets)
    private readonly cadetsRepository: Repository<Cadets>,
    @InjectRepository(MentoringLogs)
    private readonly mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}
  async getReport(reportId: string): Promise<Reports> {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: {
        cadets: true,
        mentors: true,
      },
    });
    if (!report) {
      throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
    }
    return report;
  }
  async postReport(
    filePaths: string[],
    intraId: string,
    body: CreateReportDto,
  ) {
    const authorMentor = await this.mentorsRepository.findOneBy({
      intraId: intraId,
    });
    if (!authorMentor) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    const cadet = await this.cadetsRepository.findOneBy({
      intraId: body.cadetIntraId,
    });
    if (!cadet) {
      throw new NotFoundException(`해당 카뎃를 찾을 수 없습니다`);
    }
    const mentoringLog = await this.mentoringLogsRepository.findOneBy({
      id: body.mentoringLogId,
    });
    if (!mentoringLog) {
      throw new NotFoundException(`해당 멘토링 로그를 찾을 수 없습니다`);
    }
    const newReport = this.reportsRepository.create({
      mentors: authorMentor,
      cadets: cadet,
      mentoringLogs: mentoringLog,
      imageUrl: filePaths,
      topic: body.topic,
      content: body.content,
      feedbackMessage: body.feedbackMessage,
      feedback1: +body.feedback1,
      feedback2: +body.feedback2,
      feedback3: +body.feedback3,
    });
    const ret = await this.reportsRepository.save(newReport);
    return ret;
  }


  async getAllReport() {
      const reports = await this.reportsRepository.find({
        relations: {
          cadets: true,
          mentors: true,
          mentoringLogs: true,
        },
      });
    
    const room = [];
    const data = reports?.forEach((data) => {
      room.push({
        "mentor": { "name": data.mentors.name },
        "cadet": { "name": data.cadets.name },
        "mentoringLogs": { "id": data.mentoringLogs.id, "place": data.mentoringLogs, "meetingAt": data.mentoringLogs.meetingAt }
        // FIXME: content to place
      })
    })
    
    return { "reports": room };
  }

  async sortReport(reportsSortDto: ReportsSortDto) {
    console.log('here')
    let reports;
    if (reportsSortDto.mentorName === "undefined") {
      reports = await this.mentoringLogsRepository
        .createQueryBuilder('reports')
        .leftJoinAndSelect('reports.mentors', 'mentors')
        .leftJoinAndSelect('reports.cadets', 'cadets')
        .orderBy({
          "reports.meetingAt": reportsSortDto.isUp ? 'ASC' : 'DESC',
        })
        .getMany();
    }
    else {
      reports = await this.mentoringLogsRepository
        .createQueryBuilder('reports')
        .leftJoinAndSelect('reports.mentors', 'mentors')
        .leftJoinAndSelect('reports.cadets', 'cadets')
        .where('mentors.name = :name', { name: reportsSortDto.mentorName })
        .orderBy({
          "reports.meetingAt": reportsSortDto.isUp ? 'ASC' : 'DESC',
        })
        .getMany();
    }

    console.log(reports)
    const room = [];
    const data = reports.forEach((data) => {
      room.push({
        "mentor": { "name": data.mentors.name },
        "cadet": { "name": data.cadets.name },
        "mentoringLogs": { "id": data.mentoringLogs.id, "place": data.mentoringLogs.content, "meetingAt": data.mentoringLogs.meetingAt }
      })
    })

    
      return { "reports": room };
    
  }
}

