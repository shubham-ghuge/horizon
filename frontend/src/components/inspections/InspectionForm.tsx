import React from 'react';
import { DataSource, FindingCategory } from '../../types';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Plus } from 'lucide-react';
import { FindingCard, Finding } from './FindingCard';

interface Turbine {
  id: string;
  name: string;
}

interface InspectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turbineId: string;
  setTurbineId: (id: string) => void;
  date: string;
  setDate: (date: string) => void;
  inspectorName: string;
  setInspectorName: (name: string) => void;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  rawPackageUrl: string;
  setRawPackageUrl: (url: string) => void;
  findings: Finding[];
  addFinding: () => void;
  removeFinding: (index: number) => void;
  updateFinding: (index: number, field: keyof Finding, value: any) => void;
  turbines: Turbine[];
  isCreating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  open,
  onOpenChange,
  turbineId,
  setTurbineId,
  date,
  setDate,
  inspectorName,
  setInspectorName,
  dataSource,
  setDataSource,
  rawPackageUrl,
  setRawPackageUrl,
  findings,
  addFinding,
  removeFinding,
  updateFinding,
  turbines,
  isCreating,
  onSubmit,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
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
                      <SelectItem value={DataSource.DRONE}>Drone</SelectItem>
                      <SelectItem value={DataSource.MANUAL}>Manual</SelectItem>
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
                  <FindingCard
                    key={index}
                    finding={finding}
                    index={index}
                    canRemove={findings.length > 1}
                    onUpdate={(field, value) =>
                      updateFinding(index, field, value)
                    }
                    onRemove={() => removeFinding(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !turbineId}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

