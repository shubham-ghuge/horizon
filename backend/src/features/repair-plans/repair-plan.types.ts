export interface CreateRepairPlanDto {
  inspectionId: string;
  parts: string;

  totalCost: number;
}

export interface UpdateRepairPlanDto {
  plan?: string;
}
