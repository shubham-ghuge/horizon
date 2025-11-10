import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  Length,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateTurbineDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Manufacturer is required' })
  @Length(1, 255, {
    message: 'Manufacturer must be between 1 and 255 characters',
  })
  manufacturer!: string;

  @IsNumber()
  @Min(0, { message: 'MW rating must be positive' })
  @Max(20, { message: 'MW rating must not exceed 20' })
  mwRating!: number;

  @IsNumber()
  @IsLatitude({ message: 'Invalid latitude value' })
  lat!: number;

  @IsNumber()
  @IsLongitude({ message: 'Invalid longitude value' })
  lng!: number;
}

export class UpdateTurbineDto {
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255, {
    message: 'Manufacturer must be between 1 and 255 characters',
  })
  manufacturer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'MW rating must be positive' })
  @Max(20, { message: 'MW rating must not exceed 20' })
  mwRating?: number;

  @IsOptional()
  @IsNumber()
  @IsLatitude({ message: 'Invalid latitude value' })
  lat?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude({ message: 'Invalid longitude value' })
  lng?: number;
}

export class TurbineQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
