import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRepairPlansQuery } from '../features/repairPlans/repairPlansApi';
import { Button } from '../components/ui/button';
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
import { Pagination } from '../components/ui/pagination';
import { Eye } from 'lucide-react';

export const RepairPlans: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetRepairPlansQuery({ page, limit });
  const plans = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading repair plans...</p>
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
            <CardDescription>Failed to load repair plans</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repair Plans</h1>
        <p className="text-muted-foreground">
          Generated plans based on inspection findings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Repair Plans</CardTitle>
          <CardDescription>
            {meta
              ? `${meta.total} plan${meta.total !== 1 ? 's' : ''} in the system`
              : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No repair plans found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Inspection</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        {plan.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => navigate(`/inspections/${plan.inspectionId}`)}
                        >
                          {plan.inspectionId.slice(0, 8)}...
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            plan.priority === 'HIGH'
                              ? 'destructive'
                              : plan.priority === 'MEDIUM'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {plan.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>${Number(plan.totalEstimatedCost).toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/inspections/${plan.inspectionId}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {meta && (
                <Pagination
                  className="mt-4"
                  page={page}
                  totalPages={meta.totalPages}
                  total={meta.total}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


