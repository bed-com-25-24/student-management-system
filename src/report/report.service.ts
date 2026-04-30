import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import{ PDFdocument } from 'pdf-lib'
import { Report } from './entities/report.entity'; 
import { CreateReportDto } from './dto/create-report.dto'; 
import { UpdateReportDto } from './dto/update-report.dto'; 

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
 

 ) {}

 // pulling students grades,filtering grades by term ,calculating total and average ,then saving the report 
 async createReports(classId : number ,term : string ){
  const students = await this.studentRepository.find({
    where :{classId},
    relations:['grades'],
  });

  const report =[];

  for(const student of students){
    const grades = student.grades.filter(g => g.term === term );

    const total = grades.reduce((sum,g) => sum +g.score, 0);

    const average =grades.length? total/grades.length : 0;

    const report =this.reportRepository.create({
      student,
      term,
      total,
      average,
      grades,
    });

    await this.reportRepository.save(report);
    report.push(report);
  }
  return report;
 }


 async getStudentReport(studentName: string ){
  return this.reportRepository.find({
      where: { student: { name: studentName } },
      relations: ['student'],
    });

 }

 async getClassReports(classId: number){
    return this.reportRepository.find({
      where: { student: { classId } },
      relations: ['student'],
    });

 }


 async getClassOverview(classId : number){

 }

}
