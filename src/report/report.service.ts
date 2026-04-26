import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { Report } from './entities/report.entity'; 
mport { CreateRepertDto } from './dto/create-report.dto'; 
mport { UpdateReportDto } from './dto/update-report.dto'; 

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

}
