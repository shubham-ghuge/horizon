import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Length,
  IsNumber,
  Min,
  IsEnum,
  Max,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FindingCategory {
  BLADE_DAMAGE = 'BLADE_DAMAGE',
  LIGHTNING = 'LIGHTNING',
  EROSION = 'EROSION',
  UNKNOWN = 'UNKNOWN',
}

export enum DataSource {
  DRONE = 'DRONE',
  MANUAL = 'MANUAL',
}

export class FindingDto {
  @IsNotEmpty()
  @IsEnum(FindingCategory, { message: 'Invalid category' })
  category!: FindingCategory;

  @IsNumber()
  @Min(1, { message: 'Severity must be greater than 0' })
  @Max(10, { message: 'Severity must not exceed 10' })
  severity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Estimated cost must be greater than or equal to 0' })
  estimatedCost!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateInspectionDto {
  @IsString()
  @IsNotEmpty()
  turbineId!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  inspectorName!: string;

  @IsEnum(DataSource, { message: 'Invalid data source' })
  @IsNotEmpty()
  dataSource!: DataSource;

  @IsString()
  @IsOptional()
  rawPackageUrl?: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FindingDto)
  findings!: FindingDto[];
}

export class UpdateInspectionDto {
  @IsString()
  @IsOptional()
  inspectorName?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(DataSource, { message: 'Invalid data source' })
  @IsOptional()
  dataSource?: DataSource;

  @IsString()
  @IsOptional()
  rawPackageUrl?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FindingDto)
  findings?: FindingDto[];
}

export class InspectionFilterDto {
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
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  turbineId?: string;

  @IsOptional()
  @IsEnum(DataSource, { message: 'Invalid data source' })
  dataSource?: DataSource;

  @IsOptional()
  @IsString()
  searchNotes?: string;
}
