import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import {
  useGetTurbinesQuery,
  useCreateTurbineMutation,
  useDeleteTurbineMutation,
} from '../features/turbines/turbinesApi';
import { selectHasRole } from '../features/auth/authSlice';
import { Role } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import { Trash2, Plus, Eye } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';

export const Turbines: React.FC = () => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [mwRating, setMwRating] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  // RTK Query hooks
  const { data, isLoading, error } = useGetTurbinesQuery({ page, limit });
  const turbines = data?.data?.turbines || [];
  const meta = data?.data?.meta;
  const [createTurbine, { isLoading: isCreating }] = useCreateTurbineMutation();
  const [deleteTurbine] = useDeleteTurbineMutation();

  // Role-based permissions
  const canCreate = useAppSelector(selectHasRole([Role.ADMIN, Role.ENGINEER]));
  const canDelete = useAppSelector(selectHasRole([Role.ADMIN]));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTurbine({
        name,
        manufacturer: manufacturer || undefined,
        mwRating: mwRating ? parseFloat(mwRating) : undefined,
      }).unwrap();

      // Reset form
      setName('');
      setManufacturer('');
      setMwRating('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to create turbine:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this turbine?')) {
      try {
        await deleteTurbine(id).unwrap();
      } catch (error) {
        console.error('Failed to delete turbine:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading turbines...</p>
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
            <CardDescription>Failed to load turbines</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turbines</h1>
          <p className="text-muted-foreground">
            Manage wind turbines and their inspections
          </p>
        </div>

        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Turbine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Turbine</DialogTitle>
                  <DialogDescription>
                    Add a new wind turbine to the system
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Turbine 001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="Vestas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mwRating">MW Rating</Label>
                    <Input
                      id="mwRating"
                      type="number"
                      step="0.1"
                      value={mwRating}
                      onChange={(e) => setMwRating(e.target.value)}
                      placeholder="2.5"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Turbines</CardTitle>
          <CardDescription>
            {turbines.length} turbine{turbines.length !== 1 ? 's' : ''} in the
            system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {turbines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No turbines found</p>
              {canCreate && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Turbine
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>MW Rating</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turbines.map((turbine) => (
                    <TableRow key={turbine.id}>
                      <TableCell className="font-medium">
                        {turbine.name}
                      </TableCell>
                      <TableCell>{turbine.manufacturer || '-'}</TableCell>
                      <TableCell>
                        {turbine.mwRating ? (
                          <Badge variant="outline">{turbine.mwRating} MW</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(turbine.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/turbines/${turbine.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(turbine.id)}
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
