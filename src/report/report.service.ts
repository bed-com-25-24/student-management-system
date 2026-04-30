import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
//import{ PDFdocument } from 'pdf-lib'
import { Report } from './entities/report.entity'; 
import { CreateReportDto } from './dto/create-report.dto'; 
import { UpdateReportDto } from './dto/update-report.dto'; 

@Injectable()
export class ReportService {
  createReports: any;
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
 

 ) {}

 async create(createReportDto: CreateReportDto) {
    const report = this.reportRepository.create(createReportDto);
    return this.reportRepository.save(report);
  }
  async findAll() {
    return this.reportRepository.find({ relations: ['student'] });
  }
  async findOne(id: number) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['student'],
    }); 
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.preload({
      id,
      ...updateReportDto,
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return this.reportRepository.save(report);
  } 
  async remove(id: number) {
    const report = await this.findOne(id);
    return this.reportRepository.remove(report);

  }

  async getStudentReport(studentId: number) {
    return this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.student', 'student')
      .where('student.id = :studentId', { studentId })
      .getMany();
  }
  async getClassReport(className: string) {
    return this.reportRepository
      .createQueryBuilder('report') 
  }

  async getClassOverview(className: string) {
    const reports = await this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.student', 'student')
      .leftJoin('student.class', 'studentClass')
      .where('studentClass.name = :className', { className })
      .getMany();
    const totalStudents = reports.length;
    const averageScore =
      totalStudents > 0
        ? reports.reduce((sum, report) => sum + report.average, 0) / totalStudents
        : 0;
    return { className, totalStudents, averageScore };
  }
}

  /*async generatePDFReport(reportId: number) {
    const report = await this.findOne(reportId);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    let yPosition = height - margin;
    page.drawText(`Report for ${report.student.name}`, {
      x: margin,
      y: yPosition,
      size: fontSize + 4,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 10;
    page.drawText(`Term: ${report.term}`, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 10;
    page.drawText(`Total Score: ${report.total}`, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),  
    });

    yPosition -= fontSize + 10;
    page.drawText(`Average Score: ${report.average}`, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } 

  
}

 }
 // pulling students grades,filtering grades by term ,calculating total and average ,then saving the report 
 /*async createReports(classId : number ,term : string ){
  const students = await this.studentRepository.find({
    where :{classId},
    relations:['grades'],
  });/

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
}*/
