import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export const Unauthorized: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unauthorized Access</CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/turbines">
            <Button className="w-full">Go to Turbines</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
