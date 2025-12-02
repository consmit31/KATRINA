import { useState, useEffect, useCallback } from 'react';
import { 
  addIssue,
  getAllIssues,
  getIssueByName,
  updateIssue,
  updateIssueByName,
  deleteIssue,
  addTemplateToIssue,
  removeTemplateFromIssue,
  getTemplateNamesForIssue,
  getAllIssueNames,
  StoredIssue
} from '@/app/utils/indexedDB/IssueStorage';

interface UseIssueStorageReturn {
  issues: StoredIssue[];
  loading: boolean;
  error: string | null;
  
  // Operations
  addNewIssue: (issueName: string, templateNames: string[]) => Promise<void>;
  updateExistingIssue: (issueName: string, templateNames: string[]) => Promise<void>;
  updateExistingIssueByName: (originalName: string, newName: string, templateNames: string[]) => Promise<void>;
  removeIssue: (issueName: string) => Promise<void>;
  getIssue: (issueName: string) => Promise<StoredIssue | undefined>;
  addTemplateToExistingIssue: (issueName: string, templateName: string) => Promise<void>;
  removeTemplateFromExistingIssue: (issueName: string, templateName: string) => Promise<void>;
  getTemplateNames: (issueName: string) => Promise<string[]>;
  getIssueNames: () => Promise<string[]>;
  refreshIssues: () => Promise<void>;
  
  // State management
  clearError: () => void;
}

export const useIssueStorage = (): UseIssueStorageReturn => {
  const [issues, setIssues] = useState<StoredIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all issues on mount
  const refreshIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allIssues = await getAllIssues();
      setIssues(allIssues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new issue
  const addNewIssue = useCallback(async (issueName: string, templateNames: string[]): Promise<void> => {
    try {
      setError(null);
      await addIssue(issueName, templateNames);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  // Update existing issue
  const updateExistingIssue = useCallback(async (issueName: string, templateNames: string[]): Promise<void> => {
    try {
      setError(null);
      await updateIssue(issueName, templateNames);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  // Update existing issue by name (handles name changes)
  const updateExistingIssueByName = useCallback(async (originalName: string, newName: string, templateNames: string[]): Promise<void> => {
    try {
      setError(null);
      await updateIssueByName(originalName, newName, templateNames);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  // Remove issue
  const removeIssue = useCallback(async (issueName: string): Promise<void> => {
    try {
      setError(null);
      await deleteIssue(issueName);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  // Get single issue
  const getIssue = useCallback(async (issueName: string): Promise<StoredIssue | undefined> => {
    try {
      setError(null);
      return await getIssueByName(issueName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Add template to existing issue
  const addTemplateToExistingIssue = useCallback(async (issueName: string, templateName: string): Promise<void> => {
    try {
      setError(null);
      await addTemplateToIssue(issueName, templateName);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add template to issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  // Remove template from existing issue
  const removeTemplateFromExistingIssue = useCallback(async (issueName: string, templateName: string): Promise<void> => {
    try {
      setError(null);
      await removeTemplateFromIssue(issueName, templateName);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove template from issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  // Get template names for issue
  const getTemplateNames = useCallback(async (issueName: string): Promise<string[]> => {
    try {
      setError(null);
      return await getTemplateNamesForIssue(issueName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get template names for issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Get all issue names
  const getIssueNames = useCallback(async (): Promise<string[]> => {
    try {
      setError(null);
      return await getAllIssueNames();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get issue names';
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
    refreshIssues();
  }, [refreshIssues]);

  return {
    issues,
    loading,
    error,
    addNewIssue,
    updateExistingIssue,
    updateExistingIssueByName,
    removeIssue,
    getIssue,
    addTemplateToExistingIssue,
    removeTemplateFromExistingIssue,
    getTemplateNames,
    getIssueNames,
    refreshIssues,
    clearError,
  };
};

export default useIssueStorage;
