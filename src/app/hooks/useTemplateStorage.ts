import { useState, useEffect, useCallback } from 'react';
import Template from '@dataTypes/Template';
import { 
  addTemplate, 
  getAllTemplates, 
  getTemplateByName, 
  updateTemplate, 
  deleteTemplate, 
  deleteTemplateByName,
  updateTemplateByName,
  getTemplatesByKba 
} from '@/app/utils/indexedDB/TemplateStorage';

interface UseTemplateStorageReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  
  // Operations
  addNewTemplate: (template: Template) => Promise<void>;
  updateExistingTemplate: (id: number, template: Template) => Promise<void>;
  updateTemplateByOriginalName: (originalName: string, template: Template) => Promise<void>;
  removeTemplate: (id: number) => Promise<void>;
  removeTemplateByName: (name: string) => Promise<void>;
  getTemplate: (name: string) => Promise<Template | undefined>;
  getByKba: (kba: string) => Promise<Template[]>;
  refreshTemplates: () => Promise<void>;
  
  // State management
  clearError: () => void;
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
      const allTemplates = await getAllTemplates();
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

  // Remove template
  const removeTemplate = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteTemplate(id);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshTemplates]);

  // Remove template by name
  const removeTemplateByName = useCallback(async (name: string): Promise<void> => {
    try {
      setError(null);
      await deleteTemplateByName(name);
      await refreshTemplates(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
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

  // Get single template
  const getTemplate = useCallback(async (name: string): Promise<Template | undefined> => {
    try {
      setError(null);
      return await getTemplateByName(name);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get template';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Get templates by KBA
  const getByKba = useCallback(async (kba: string): Promise<Template[]> => {
    try {
      setError(null);
      return await getTemplatesByKba(kba);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get templates by KBA';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

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
    updateExistingTemplate,
    updateTemplateByOriginalName,
    removeTemplate,
    removeTemplateByName,
    getTemplate,
    getByKba,
    refreshTemplates,
    clearError,
  };
};

export default useTemplateStorage;