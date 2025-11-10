import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  ValidateNested,
  Length,
  IsNumber,
  Min,
  IsEnum,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FindingCategory {
  BLADE_DAMAGE = 'BLADE_DAMAGE',
  LIGHTNING = 'LIGHTNING',
  EROSION = 'EROSION',
  UNKNOWN = 'UNKNOWN',
}

export enum InspectionDataSource {
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

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Description must be between 1 and 255 characters',
  })
  description!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Estimated cost must be greater than 0' })
  estimatedCost!: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Notes must be between 1 and 255 characters' })
  notes!: string;
}

export class CreateInspectionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Turbine ID must be between 1 and 255 characters',
  })
  turbineId!: string;

  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Data source must be between 1 and 255 characters',
  })
  dataSource!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Recording URL must be between 1 and 255 characters',
  })
  recordingUrl!: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FindingDto)
  findings!: FindingDto[];
}

export class UpdateInspectionDto extends CreateInspectionDto {}
