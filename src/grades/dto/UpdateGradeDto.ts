import {PartialType} from '@nestjs/mapped-types';
import { CreateGradeDto } from './CreateGradeDto' ;
export class UpdateGradeDto extends PartialType(CreateGradeDto){}