import { useState, useEffect } from 'react';
import { DataSource } from '../types';
import { useGetInspectionsMutation } from '../features/inspections/inspectionApi';

export const useInspectionFilters = () => {
  const [page, setPage] = useState(1);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterTurbineId, setFilterTurbineId] = useState('all');
  const [filterDataSource, setFilterDataSource] = useState<DataSource | 'all'>('all');
  const [filterSearchNotes, setFilterSearchNotes] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [getInspections, { data: inspectionsData, isLoading, error }] =
    useGetInspectionsMutation();

  // Fetch inspections when filters or page change
  useEffect(() => {
    const filters: any = { page, limit: 10 };
    if (filterStartDate) filters.startDate = filterStartDate;
    if (filterEndDate) filters.endDate = filterEndDate;
    if (filterTurbineId && filterTurbineId !== 'all') filters.turbineId = filterTurbineId;
    if (filterDataSource && filterDataSource !== 'all') filters.dataSource = filterDataSource;
    if (filterSearchNotes) filters.searchNotes = filterSearchNotes;

    getInspections(filters);
  }, [
    page,
    filterStartDate,
    filterEndDate,
    filterTurbineId,
    filterDataSource,
    filterSearchNotes,
    getInspections,
  ]);

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

