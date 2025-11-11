import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
 
export interface CreateRepairPlanDto {
  inspectionId: string;
  parts: string;
  totalCost: number;
}
 
export interface UpdateRepairPlanDto {
  priority?: Priority;
  totalEstimatedCost?: number;
  snapshotJson?: any;
}
 
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
 
export class RepairPlanFilterDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
 
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
 
  @IsOptional()
  @IsEnum(Priority, { message: 'Invalid priority' })
  priority?: Priority;
 
  @IsOptional()
  @IsString()
  turbineId?: string;
 
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minTotalEstimatedCost?: number;
 
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxTotalEstimatedCost?: number;
 
  @IsOptional()
  @IsDateString()
  startDate?: string;
 
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
