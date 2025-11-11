import { useState } from 'react';
import { DataSource, FindingCategory } from '../types';
import { useCreateInspectionMutation } from '../features/inspections/inspectionApi';
import { Finding } from '../components/inspections/FindingCard';

const DEFAULT_FINDING: Finding = {
  category: FindingCategory.BLADE_DAMAGE,
  severity: 1,
  estimatedCost: 0,
  notes: '',
};

export const useInspectionForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [turbineId, setTurbineId] = useState('');
  const [date, setDate] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.DRONE);
  const [rawPackageUrl, setRawPackageUrl] = useState('');
  const [findings, setFindings] = useState<Finding[]>([{ ...DEFAULT_FINDING }]);

  const [
    createInspection,
    { isLoading: isCreating, isError: isCreateError, error: createError },
  ] = useCreateInspectionMutation();

  const addFinding = () => {
    setFindings([...findings, { ...DEFAULT_FINDING }]);
  };

  const removeFinding = (index: number) => {
    if (findings.length > 1) {
      setFindings(findings.filter((_, i) => i !== index));
    }
  };

  const updateFinding = (index: number, field: keyof Finding, value: any) => {
    const updatedFindings = [...findings];
    updatedFindings[index] = {
      ...updatedFindings[index],
      [field]: value,
    };
    setFindings(updatedFindings);
  };

  const resetForm = () => {
    setTurbineId('');
    setDate('');
    setInspectorName('');
    setDataSource(DataSource.DRONE);
    setRawPackageUrl('');
    setFindings([{ ...DEFAULT_FINDING }]);
  };

  const parseErrorMessage = (err: unknown): string => {
    const anyErr = err as any;
    if (!anyErr) return '';
    if ('status' in anyErr) {
      const data = anyErr.data;
      if (typeof data === 'string') return data;
      if (data?.message) return data.message as string;
      return `Request failed with status ${anyErr.status}`;
    }
    if (anyErr?.message) return anyErr.message as string;
    return 'Failed to create inspection';
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createInspection({
        turbineId,
        date,
        inspectorName,
        dataSource,
        rawPackageUrl: rawPackageUrl || undefined,
        findings: findings.map((f) => ({
          category: f.category,
          severity: f.severity,
          estimatedCost: f.estimatedCost,
          notes: f.notes || undefined,
        })),
      }).unwrap();

      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to create inspection:', error);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    resetForm();
  };

  return {
    // Dialog state
    dialogOpen,
    setDialogOpen,
    // Form state
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
    // Finding management
    addFinding,
    removeFinding,
    updateFinding,
    // Form actions
    isCreating,
    isCreateError,
    createErrorMessage: parseErrorMessage(createError),
    handleCreate,
    handleCancel,
    resetForm,
  };
};

