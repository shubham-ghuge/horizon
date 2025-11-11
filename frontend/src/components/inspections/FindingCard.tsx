import React from 'react';
import { FindingCategory } from '../../types';
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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X } from 'lucide-react';

export interface Finding {
  category: FindingCategory;
  severity: number;
  estimatedCost: number;
  notes: string;
}

interface FindingCardProps {
  finding: Finding;
  index: number;
  canRemove: boolean;
  onUpdate: (field: keyof Finding, value: any) => void;
  onRemove: () => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  index,
  canRemove,
  onUpdate,
  onRemove,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Finding #{index + 1}</CardTitle>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor={`category-${index}`}>Category *</Label>
            <Select
              value={finding.category}
              onValueChange={(value) =>
                onUpdate('category', value as FindingCategory)
              }
            >
              <SelectTrigger id={`category-${index}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FindingCategory.BLADE_DAMAGE}>
                  Blade Damage
                </SelectItem>
                <SelectItem value={FindingCategory.LIGHTNING}>
                  Lightning
                </SelectItem>
                <SelectItem value={FindingCategory.EROSION}>Erosion</SelectItem>
                <SelectItem value={FindingCategory.UNKNOWN}>Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`severity-${index}`}>Severity (1-10) *</Label>
            <Input
              id={`severity-${index}`}
              type="number"
              min="1"
              max="10"
              value={finding.severity}
              onChange={(e) => onUpdate('severity', parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`cost-${index}`}>Estimated Cost ($) *</Label>
          <Input
            id={`cost-${index}`}
            type="number"
            min="0"
            step="0.01"
            value={finding.estimatedCost}
            onChange={(e) => onUpdate('estimatedCost', parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`notes-${index}`}>Notes (Optional)</Label>
          <Input
            id={`notes-${index}`}
            value={finding.notes}
            onChange={(e) => onUpdate('notes', e.target.value)}
            placeholder="Additional details..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

