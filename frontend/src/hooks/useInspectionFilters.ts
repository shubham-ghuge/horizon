import { useMemo, useState } from 'react';
import { DataSource } from '../types';
import { useGetInspectionsQuery } from '../features/inspections/inspectionApi';

export const useInspectionFilters = () => {
  const [page, setPage] = useState(1);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterTurbineId, setFilterTurbineId] = useState('all');
  const [filterDataSource, setFilterDataSource] = useState<DataSource | 'all'>('all');
  const [filterSearchNotes, setFilterSearchNotes] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => {
    const f: any = { page, limit: 10 };
    if (filterStartDate) f.startDate = filterStartDate;
    if (filterEndDate) f.endDate = filterEndDate;
    if (filterTurbineId && filterTurbineId !== 'all') f.turbineId = filterTurbineId;
    if (filterDataSource && filterDataSource !== 'all') f.dataSource = filterDataSource;
    if (filterSearchNotes) f.searchNotes = filterSearchNotes;
    return f;
  }, [
    page,
    filterStartDate,
    filterEndDate,
    filterTurbineId,
    filterDataSource,
    filterSearchNotes,
  ]);

  const { data: inspectionsData, isLoading, error } = useGetInspectionsQuery(filters);

  return {
    // State
    page,
    filterStartDate,
    filterEndDate,
    filterTurbineId,
    filterDataSource,
    filterSearchNotes,
    showFilters,
    // Setters
    setPage,
    setFilterStartDate,
    setFilterEndDate,
    setFilterTurbineId,
    setFilterDataSource,
    setFilterSearchNotes,
    setShowFilters,
    // Data
    inspectionsData,
    isLoading,
    error,
  };
};

