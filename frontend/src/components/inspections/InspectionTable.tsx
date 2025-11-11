import React from 'react';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Trash2, Plus, Eye } from 'lucide-react';
import { Pagination } from '../ui/pagination';

interface Finding {
  severity: number;
  category: string;
}

interface Inspection {
  id: string;
  date: string;
  inspectorName?: string;
  dataSource: string;
  findings?: Finding[];
  turbine?: {
    name: string;
  };
}

interface Meta {
  page: number;
  totalPages: number;
  total: number;
}

interface InspectionTableProps {
  inspections: Inspection[];
  meta?: Meta;
  canCreate: boolean;
  canDelete: boolean;
  page: number;
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onAddInspection: () => void;
}

const getSeverityBadgeVariant = (severity: number) => {
  if (severity >= 8) return 'destructive';
  if (severity >= 5) return 'default';
  return 'secondary';
};

export const InspectionTable: React.FC<InspectionTableProps> = ({
  inspections,
  meta,
  canCreate,
  canDelete,
  page,
  onViewDetails,
  onDelete,
  onPageChange,
  onAddInspection,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Inspections</CardTitle>
        <CardDescription>
          {meta
            ? `${meta.total} inspection${meta.total !== 1 ? 's' : ''} in the system`
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
                onClick={onAddInspection}
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
                      {inspection.findings && inspection.findings.length > 0 ? (
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
                          onClick={() => onViewDetails(inspection.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(inspection.id)}
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
            {meta && (
              <Pagination
                className="mt-4"
                page={page}
                totalPages={meta.totalPages}
                total={meta.total}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

