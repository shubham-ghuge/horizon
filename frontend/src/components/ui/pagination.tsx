import React from 'react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const goToPrevious = () => onPageChange(Math.max(1, page - 1));
  const goToNext = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
        {typeof total === 'number' ? ` • ${total} total` : ''}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={goToPrevious} disabled={page === 1}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};


