import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTurbineByIdQuery } from '../features/turbines/turbinesApi';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import { Button } from '../components/ui/button';

export const TurbineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: fetchedData,
    isLoading,
    error,
  } = useGetTurbineByIdQuery(id || '', { skip: !id });

  const data = fetchedData?.data;

  if (!id) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading turbine...</p>
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
            <CardDescription>Failed to load turbine</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
          <p className="text-muted-foreground">Turbine details</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Manufacturer</span>
            <div>{data.manufacturer || '-'}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">MW Rating</span>
            <div>{data.mwRating ?? '-'}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Created</span>
            <div>{new Date(data.createdAt).toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
