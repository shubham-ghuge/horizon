import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInspectionByIdQuery } from '../features/inspections/inspectionApi';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const severityVariant = (severity: number) => {
  if (severity >= 8) return 'destructive' as const;
  if (severity >= 5) return 'default' as const;
  return 'secondary' as const;
};

export const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: fetchedData,
    isLoading,
    error,
  } = useGetInspectionByIdQuery(id || '', { skip: !id });
  const data = fetchedData?.data;

  if (!id) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading inspection...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load inspection</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspection</h1>
          <p className="text-muted-foreground">
            {data.turbine?.name || 'Unknown turbine'} •{' '}
            {new Date(data.date).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Inspector</span>
            <div>{data.inspectorName || '-'}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Data Source</span>
            <div>
              <Badge variant="outline">{data.dataSource}</Badge>
            </div>
          </div>
          {data.rawPackageUrl && (
            <div className="md:col-span-2">
              <span className="text-sm text-muted-foreground">Raw Package</span>
              <div className="truncate text-blue-600">{data.rawPackageUrl}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.findings && data.findings.length > 0 ? (
            data.findings.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={severityVariant(f.severity)}>
                    {f.severity}
                  </Badge>
                  <div className="font-medium">{f.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${Number(f.estimatedCost).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {f.notes ? f.notes : 'No notes'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No findings recorded</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
