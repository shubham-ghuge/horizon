// Enums
export enum Role {
  ADMIN = 'ADMIN',
  ENGINEER = 'ENGINEER',
  VIEWER = 'VIEWER',
}

export enum DataSource {
  DRONE = 'DRONE',
  MANUAL = 'MANUAL',
}

export enum FindingCategory {
  BLADE_DAMAGE = 'BLADE_DAMAGE',
  LIGHTNING = 'LIGHTNING',
  EROSION = 'EROSION',
  UNKNOWN = 'UNKNOWN',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// Domain Models
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Turbine {
  id: string;
  name: string;
  manufacturer?: string;
  mwRating?: number;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  date: string;
  inspectorName?: string;
  dataSource: DataSource;
  rawPackageUrl?: string;
  turbineId: string;
  turbine?: Turbine;
  findings?: Finding[];
  repairPlan?: RepairPlan;
  createdAt: string;
}

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: number;
  estimatedCost: number;
  notes?: string;
  inspectionId: string;
  createdAt: string;
}

export interface RepairPlan {
  id: string;
  inspectionId: string;
  priority: Priority;
  totalEstimatedCost: number;
  snapshotJson: any;
  createdAt: string;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateTurbineRequest {
  name: string;
  manufacturer?: string;
  mwRating?: number;
  lat?: number;
  lng?: number;
}

export interface CreateInspectionRequest {
  turbineId: string;
  date: string;
  inspectorName: string;
  dataSource: DataSource;
  rawPackageUrl?: string;
  findings: {
    category: FindingCategory;
    severity: number;
    estimatedCost: number;
    notes?: string;
  }[];
}

export interface CreateFindingRequest {
  inspectionId: string;
  category: FindingCategory;
  severity: number;
  estimatedCost: number;
  notes?: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface TurbinesResponse {
  turbines: Turbine[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InspectionsResponse {
  data: Inspection[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface InspectionFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  turbineId?: string;
  dataSource?: DataSource;
  searchNotes?: string;
}
