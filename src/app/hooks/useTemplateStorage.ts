import { useState, useEffect, useCallback } from 'react';
import Template from '@dataTypes/Template';
import TemplateMetric from '@dataTypes/TemplateMetric';
import { 
  addTemplate, 
  deleteTemplateById, 
  deleteTemplateByName,
  getAllTemplates as getAllTemplatesFromDB, 
  getTemplateByName, 
  updateTemplate, 
  updateTemplateByName,
  incrementTemplateUsage as incrementTemplateUsageInDB, 
  decrementTemplateUsage as decrementTemplateUsageInDB,
  getTemplateMetrics as getTemplateMetricsFromDB,
  appendToCommonWorkLog as appendToCommonWorkLogInDB,
  removeFromCommonWorkLog as removeFromCommonWorkLogInDB,
} from '@/app/utils/indexedDB/TemplateStorage';

interface UseTemplateStorageReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  
  // Operations
  addNewTemplate: (template: Template) => Promise<void>;
  deleteExistingTemplate: (id: number | string) => Promise<void>;
  getAllTemplates: () => Promise<Template[]>; 
  getExistingTemplate: (name: string) => Promise<Template | undefined>;
  updateExistingTemplate: (id: number, template: Template) => Promise<void>;
  updateTemplateByOriginalName: (originalName: string, template: Template) => Promise<void>;
  incrementTemplateUsage: (name: string) => Promise<void>;
  decrementTemplateUsage: (name: string) => Promise<void>;
  getTemplateMetrics: (name: string) => Promise<TemplateMetric | undefined>;
  appendToCommonWorkLog: (name: string, workLog: string) => Promise<void>;
  removeFromCommonWorkLog: (name: string, workLog: string) => Promise<void>;
  
  // State management
  clearError: () => void;
  refreshTemplates: () => Promise<void>;
}

export const useTemplateStorage = (): UseTemplateStorageReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all templates on mount
  const refreshTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allTemplates = await getAllTemplatesFromDB();
      setTemplates(allTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new template
  const addNewTemplate = useCallback(async (template: Template): Promise<void> => {
    try {
      setError(null);
      await addTemplate(template);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Delete existing template
  const deleteExistingTemplate = useCallback(async (id: number | string): Promise<void> => {
    try {
      setError(null);
      if (typeof id === 'number') {
        await deleteTemplateById(id);
      } else {
        await deleteTemplateByName(id);
      }
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  const getAllTemplates = useCallback(async (): Promise<Template[]> => {
    try {
      setError(null);
      const allTemplates = await getAllTemplatesFromDB();
      return allTemplates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get templates';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);   
  
  // Get existing template
  const getExistingTemplate = useCallback(async (name: string): Promise<Template | undefined> => {
    try {
      setError(null);
      const template = await getTemplateByName(name);
      return template;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update existing template
  const updateExistingTemplate = useCallback(async (id: number, template: Template): Promise<void> => {
    try {
      setError(null);
      await updateTemplate(id, template);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Update template by original name (handles name changes)
  const updateTemplateByOriginalName = useCallback(async (originalName: string, template: Template): Promise<void> => {
    try {
      setError(null);
      await updateTemplateByName(originalName, template);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Increment template usage
  const incrementTemplateUsage = useCallback(async (name: string): Promise<void> => {
    try {
      setError(null);
      await incrementTemplateUsageInDB(name);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to increment template usage';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Decrement template usage
  const decrementTemplateUsage = useCallback(async (name: string): Promise<void> => {
    try {
      setError(null);
      await decrementTemplateUsageInDB(name);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrement template usage';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Get template metrics
  const getTemplateMetrics = useCallback(async (name: string): Promise<TemplateMetric | undefined> => {
    try {
      setError(null);
      const metrics = await getTemplateMetricsFromDB(name);
      return metrics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get template metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Append to common work log
  const appendToCommonWorkLog = useCallback(async (name: string, workLog: string): Promise<void> => {
    try {
      setError(null);
      await appendToCommonWorkLogInDB(name, workLog);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to append to work log';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Remove from common work log
  const removeFromCommonWorkLog = useCallback(async (name: string, workLog: string): Promise<void> => {
    try {
      setError(null);
      await removeFromCommonWorkLogInDB(name, workLog);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from work log';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    refreshTemplates();
  }, [refreshTemplates]);

  return {
    templates,
    loading,
    error,
    addNewTemplate,
    deleteExistingTemplate,
    getAllTemplates,
    getExistingTemplate,
    updateExistingTemplate,
    updateTemplateByOriginalName,
    incrementTemplateUsage,
    decrementTemplateUsage,
    getTemplateMetrics,
    appendToCommonWorkLog,
    removeFromCommonWorkLog,
    clearError,
    refreshTemplates,
  };
};

export default useTemplateStorage;