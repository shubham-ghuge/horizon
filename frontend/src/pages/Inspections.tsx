import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import {
  useGetInspectionsMutation,
  useCreateInspectionMutation,
  useDeleteInspectionMutation,
} from '../features/inspections/inspectionApi';
import { useGetTurbinesQuery } from '../features/turbines/turbinesApi';
import { selectHasRole } from '../features/auth/authSlice';
import { Role, DataSource, FindingCategory } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Trash2, Plus, Eye, X, Filter } from 'lucide-react';

interface Finding {
  category: FindingCategory;
  severity: number;
  estimatedCost: number;
  notes: string;
}

export const Inspections: React.FC = () => {
  // Form state
  const [turbineId, setTurbineId] = useState('');
  const [date, setDate] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.DRONE);
  const [rawPackageUrl, setRawPackageUrl] = useState('');
  const [findings, setFindings] = useState<Finding[]>([
    {
      category: FindingCategory.BLADE_DAMAGE,
      severity: 1,
      estimatedCost: 0,
      notes: '',
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter state
  const [page, setPage] = useState(1);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterTurbineId, setFilterTurbineId] = useState('');
  const [filterDataSource, setFilterDataSource] = useState<DataSource | ''>('');
  const [filterSearchNotes, setFilterSearchNotes] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // RTK Query hooks
  const [getInspections, { data: inspectionsData, isLoading, error }] =
    useGetInspectionsMutation();
  const [createInspection, { isLoading: isCreating }] =
    useCreateInspectionMutation();
  const [deleteInspection] = useDeleteInspectionMutation();
  const { data: turbinesData } = useGetTurbinesQuery({ page: 1, limit: 100 });

  // Auth
  const canCreate = useAppSelector(selectHasRole([Role.ADMIN, Role.ENGINEER]));
  const canDelete = useAppSelector(selectHasRole([Role.ADMIN]));

  // Extract data
  const inspections = inspectionsData?.data?.data || [];
  const meta = inspectionsData?.data?.meta;
  const turbines = turbinesData?.data?.turbines || [];

  // Fetch inspections when filters or page change
  useEffect(() => {
    const filters: any = { page, limit: 10 };
    if (filterStartDate) filters.startDate = filterStartDate;
    if (filterEndDate) filters.endDate = filterEndDate;
    if (filterTurbineId) filters.turbineId = filterTurbineId;
    if (filterDataSource) filters.dataSource = filterDataSource;
    if (filterSearchNotes) filters.searchNotes = filterSearchNotes;

    getInspections(filters);
  }, [
    page,
    filterStartDate,
    filterEndDate,
    filterTurbineId,
    filterDataSource,
    filterSearchNotes,
    getInspections,
  ]);

  const addFinding = () => {
    setFindings([
      ...findings,
      {
        category: FindingCategory.BLADE_DAMAGE,
        severity: 1,
        estimatedCost: 0,
        notes: '',
      },
    ]);
  };

  const removeFinding = (index: number) => {
    if (findings.length > 1) {
      setFindings(findings.filter((_, i) => i !== index));
    }
  };

  const updateFinding = (index: number, field: keyof Finding, value: any) => {
    const updatedFindings = [...findings];
    updatedFindings[index] = {
      ...updatedFindings[index],
      [field]: value,
    };
    setFindings(updatedFindings);
  };

  const resetForm = () => {
    setTurbineId('');
    setDate('');
    setInspectorName('');
    setDataSource(DataSource.DRONE);
    setRawPackageUrl('');
    setFindings([
      {
        category: FindingCategory.BLADE_DAMAGE,
        severity: 1,
        estimatedCost: 0,
        notes: '',
      },
    ]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createInspection({
        turbineId,
        date,
        inspectorName,
        dataSource,
        rawPackageUrl: rawPackageUrl || undefined,
        findings: findings.map((f) => ({
          category: f.category,
          severity: f.severity,
          estimatedCost: f.estimatedCost,
          notes: f.notes || undefined,
        })),
      }).unwrap();

      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to create inspection:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      try {
        await deleteInspection(id).unwrap();
      } catch (error) {
        console.error('Failed to delete inspection:', error);
      }
    }
  };

  const getSeverityBadgeVariant = (severity: number) => {
    if (severity >= 8) return 'destructive';
    if (severity >= 5) return 'default';
    return 'secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading inspections...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Inspection</DialogTitle>
                  <DialogDescription>
                    Add a new inspection with findings
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="turbine">Turbine *</Label>
                        <Select value={turbineId} onValueChange={setTurbineId}>
                          <SelectTrigger id="turbine">
                            <SelectValue placeholder="Select turbine" />
                          </SelectTrigger>
                          <SelectContent>
                            {turbines.map((turbine) => (
                              <SelectItem key={turbine.id} value={turbine.id}>
                                {turbine.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inspector">Inspector Name *</Label>
                        <Input
                          id="inspector"
                          value={inspectorName}
                          onChange={(e) => setInspectorName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataSource">Data Source *</Label>
                        <Select
                          value={dataSource}
                          onValueChange={(value) =>
                            setDataSource(value as DataSource)
                          }
                        >
                          <SelectTrigger id="dataSource">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={DataSource.DRONE}>
                              Drone
                            </SelectItem>
                            <SelectItem value={DataSource.MANUAL}>
                              Manual
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rawPackageUrl">
                        Raw Package URL (Optional)
                      </Label>
                      <Input
                        id="rawPackageUrl"
                        value={rawPackageUrl}
                        onChange={(e) => setRawPackageUrl(e.target.value)}
                        placeholder="https://example.com/package.zip"
                        type="url"
                      />
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        Findings ({findings.length})
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFinding}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Finding
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {findings.map((finding, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">
                                Finding #{index + 1}
                              </CardTitle>
                              {findings.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFinding(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`category-${index}`}>
                                  Category *
                                </Label>
                                <Select
                                  value={finding.category}
                                  onValueChange={(value) =>
                                    updateFinding(
                                      index,
                                      'category',
                                      value as FindingCategory
                                    )
                                  }
                                >
                                  <SelectTrigger id={`category-${index}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value={FindingCategory.BLADE_DAMAGE}
                                    >
                                      Blade Damage
                                    </SelectItem>
                                    <SelectItem
                                      value={FindingCategory.LIGHTNING}
                                    >
                                      Lightning
                                    </SelectItem>
                                    <SelectItem value={FindingCategory.EROSION}>
                                      Erosion
                                    </SelectItem>
                                    <SelectItem value={FindingCategory.UNKNOWN}>
                                      Unknown
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`severity-${index}`}>
                                  Severity (1-10) *
                                </Label>
                                <Input
                                  id={`severity-${index}`}
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={finding.severity}
                                  onChange={(e) =>
                                    updateFinding(
                                      index,
                                      'severity',
                                      parseInt(e.target.value)
                                    )
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`cost-${index}`}>
                                Estimated Cost ($) *
                              </Label>
                              <Input
                                id={`cost-${index}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={finding.estimatedCost}
                                onChange={(e) =>
                                  updateFinding(
                                    index,
                                    'estimatedCost',
                                    parseFloat(e.target.value)
                                  )
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`notes-${index}`}>
                                Notes (Optional)
                              </Label>
                              <Input
                                id={`notes-${index}`}
                                value={finding.notes}
                                onChange={(e) =>
                                  updateFinding(index, 'notes', e.target.value)
                                }
                                placeholder="Additional details..."
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || !turbineId}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters Section */}
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
                    setPage(1);
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
                    setPage(1);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-turbine">Turbine</Label>
                <Select
                  value={filterTurbineId}
                  onValueChange={(value) => {
                    setFilterTurbineId(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="filter-turbine">
                    <SelectValue placeholder="All turbines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All turbines</SelectItem>
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
                    setFilterDataSource(value as DataSource | '');
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="filter-dataSource">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All sources</SelectItem>
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
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {(filterStartDate ||
              filterEndDate ||
              filterTurbineId ||
              filterDataSource ||
              filterSearchNotes) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setFilterTurbineId('');
                    setFilterDataSource('');
                    setFilterSearchNotes('');
                    setPage(1);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Inspections</CardTitle>
          <CardDescription>
            {meta
              ? `${meta.total} inspection${
                  meta.total !== 1 ? 's' : ''
                } in the system`
              : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inspections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No inspections found</p>
              {canCreate && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Inspection
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turbine</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Data Source</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-medium">
                        {inspection.turbine?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {new Date(inspection.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{inspection.inspectorName || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{inspection.dataSource}</Badge>
                      </TableCell>
                      <TableCell>
                        {inspection.findings &&
                        inspection.findings.length > 0 ? (
                          <div className="flex gap-1">
                            {inspection.findings.map((finding, idx) => (
                              <Badge
                                key={idx}
                                variant={getSeverityBadgeVariant(
                                  finding.severity
                                )}
                                className="text-xs"
                              >
                                {finding.severity}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/inspections/${inspection.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(inspection.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
