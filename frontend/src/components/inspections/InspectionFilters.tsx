import React from 'react';
import { DataSource } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Filter } from 'lucide-react';

interface Turbine {
  id: string;
  name: string;
}

interface InspectionFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterStartDate: string;
  setFilterStartDate: (date: string) => void;
  filterEndDate: string;
  setFilterEndDate: (date: string) => void;
  filterTurbineId: string;
  setFilterTurbineId: (id: string) => void;
  filterDataSource: DataSource | 'all';
  setFilterDataSource: (source: DataSource | 'all') => void;
  filterSearchNotes: string;
  setFilterSearchNotes: (notes: string) => void;
  turbines: Turbine[];
  onPageChange: (page: number) => void;
}

export const InspectionFilters: React.FC<InspectionFiltersProps> = ({
  showFilters,
  setShowFilters,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterTurbineId,
  setFilterTurbineId,
  filterDataSource,
  setFilterDataSource,
  filterSearchNotes,
  setFilterSearchNotes,
  turbines,
  onPageChange,
}) => {
  const hasActiveFilters =
    filterStartDate ||
    filterEndDate ||
    (filterTurbineId && filterTurbineId !== 'all') ||
    (filterDataSource && filterDataSource !== 'all') ||
    filterSearchNotes;

  const clearAllFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterTurbineId('all');
    setFilterDataSource('all');
    setFilterSearchNotes('');
    onPageChange(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter inspections by date, turbine, or search notes
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </CardHeader>
      {showFilters && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-startDate">Start Date</Label>
              <Input
                id="filter-startDate"
                type="date"
                value={filterStartDate}
                onChange={(e) => {
                  setFilterStartDate(e.target.value);
                  onPageChange(1);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-endDate">End Date</Label>
              <Input
                id="filter-endDate"
                type="date"
                value={filterEndDate}
                onChange={(e) => {
                  setFilterEndDate(e.target.value);
                  onPageChange(1);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-turbine">Turbine</Label>
              <Select
                value={filterTurbineId}
                onValueChange={(value) => {
                  setFilterTurbineId(value);
                  onPageChange(1);
                }}
              >
                <SelectTrigger id="filter-turbine">
                  <SelectValue placeholder="All turbines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All turbines</SelectItem>
                  {turbines.map((turbine) => (
                    <SelectItem key={turbine.id} value={turbine.id}>
                      {turbine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-dataSource">Data Source</Label>
              <Select
                value={filterDataSource}
                onValueChange={(value) => {
                  setFilterDataSource(value as DataSource | 'all');
                  onPageChange(1);
                }}
              >
                <SelectTrigger id="filter-dataSource">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value={DataSource.DRONE}>Drone</SelectItem>
                  <SelectItem value={DataSource.MANUAL}>Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="filter-searchNotes">Search Notes</Label>
              <Input
                id="filter-searchNotes"
                type="text"
                placeholder="Search in findings notes..."
                value={filterSearchNotes}
                onChange={(e) => {
                  setFilterSearchNotes(e.target.value);
                  onPageChange(1);
                }}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

