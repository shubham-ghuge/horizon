import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { useDeleteInspectionMutation } from '../features/inspections/inspectionApi';
import { useGetTurbinesQuery } from '../features/turbines/turbinesApi';
import { selectHasRole } from '../features/auth/authSlice';
import { Role } from '../types';
import { Button } from '../components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { DialogTrigger } from '../components/ui/dialog';
import { Plus } from 'lucide-react';
import { InspectionFilters } from '../components/inspections/InspectionFilters';
import { InspectionForm } from '../components/inspections/InspectionForm';
import { InspectionTable } from '../components/inspections/InspectionTable';
import { useInspectionFilters } from '../hooks/useInspectionFilters';
import { useInspectionForm } from '../hooks/useInspectionForm';

export const Inspections: React.FC = () => {
  const navigate = useNavigate();

  // Custom hooks
  const filters = useInspectionFilters();
  const form = useInspectionForm();

  // RTK Query hooks
  const [deleteInspection] = useDeleteInspectionMutation();
  const { data: turbinesData } = useGetTurbinesQuery({ page: 1, limit: 100 });

  // Auth
  const canCreate = useAppSelector(selectHasRole([Role.ADMIN, Role.ENGINEER]));
  const canDelete = useAppSelector(selectHasRole([Role.ADMIN]));

  // Extract data
  const inspections = filters.inspectionsData?.data?.data || [];
  const meta = filters.inspectionsData?.data?.meta;
  const turbines = turbinesData?.data?.turbines || [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      try {
        await deleteInspection(id).unwrap();
      } catch (error) {
        console.error('Failed to delete inspection:', error);
      }
    }
  };

  if (filters.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading inspections...</p>
        </div>
      </div>
    );
  }

  if (filters.error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load inspections</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">
            Manage turbine inspections and findings
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => form.setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Inspection
          </Button>
        )}
      </div>

      <InspectionFilters
        showFilters={filters.showFilters}
        setShowFilters={filters.setShowFilters}
        filterStartDate={filters.filterStartDate}
        setFilterStartDate={filters.setFilterStartDate}
        filterEndDate={filters.filterEndDate}
        setFilterEndDate={filters.setFilterEndDate}
        filterTurbineId={filters.filterTurbineId}
        setFilterTurbineId={filters.setFilterTurbineId}
        filterDataSource={filters.filterDataSource}
        setFilterDataSource={filters.setFilterDataSource}
        filterSearchNotes={filters.filterSearchNotes}
        setFilterSearchNotes={filters.setFilterSearchNotes}
        turbines={turbines}
        onPageChange={filters.setPage}
      />

      <InspectionTable
        inspections={inspections}
        meta={meta}
        canCreate={canCreate}
        canDelete={canDelete}
        page={filters.page}
        onViewDetails={(id) => navigate(`/inspections/${id}`)}
        onDelete={handleDelete}
        onPageChange={filters.setPage}
        onAddInspection={() => form.setDialogOpen(true)}
      />

      <InspectionForm
        open={form.dialogOpen}
        onOpenChange={form.setDialogOpen}
        turbineId={form.turbineId}
        setTurbineId={form.setTurbineId}
        date={form.date}
        setDate={form.setDate}
        inspectorName={form.inspectorName}
        setInspectorName={form.setInspectorName}
        dataSource={form.dataSource}
        setDataSource={form.setDataSource}
        rawPackageUrl={form.rawPackageUrl}
        setRawPackageUrl={form.setRawPackageUrl}
        findings={form.findings}
        addFinding={form.addFinding}
        removeFinding={form.removeFinding}
        updateFinding={form.updateFinding}
        turbines={turbines}
        isCreating={form.isCreating}
        errorMessage={form.isCreateError ? form.createErrorMessage : undefined}
        onSubmit={form.handleCreate}
        onCancel={form.handleCancel}
      />
    </div>
  );
};
