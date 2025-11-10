export interface CreateTurbineDto {
  name: string;
  manufacturer: string;
  mwRating: number;
  lat: number;
  lng: number;
}

export interface UpdateTurbineDto {
  name?: string;
  manufacturer?: string;
  mwRating?: number;
  lat?: number;
  lng?: number;
}
