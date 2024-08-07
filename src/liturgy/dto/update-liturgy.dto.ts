import { PartialType } from '@nestjs/mapped-types';
import { CreateLiturgyDto } from './create-liturgy.dto';

export class UpdateLiturgyDto extends PartialType(CreateLiturgyDto) {}
