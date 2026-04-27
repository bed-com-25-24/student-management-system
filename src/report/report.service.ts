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
 
    @InjectRepository(Grade)
    private gradeRepository :Repository<Grade>,

    @InjectRepository(Student)
    private studentRepository : Repository<Student>,

 ) {}

 // pulling students grades,filtering grades by term ,calculating total and average ,then saving the report 
 async generateReports(classId : number ,term : string ){
  const students = await this.studentRepository.find({
    where :{classId},
    relations:['grades'],
  });

  const report =[];

  for(const student of students){
    const grades = students.grades.filter(g => g.term === term );

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

 }

 async getClassReports(classId: number){

 }


 async getClassOverview(classId : number){

 }

 //PDF Generation 
 async generatePDF(report : Report ){
  const pdfDoc = await PDFdocument.create();
  const page = pdfDoc.addpage();

  page.drawText('Name: $ {report.student.name}');
  page.drawText('Average: $ {report.average}');

  const pdfBytes = await pdfDoc.save();
  return pdfBytes
 }
}
