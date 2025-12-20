import { useState, useEffect, useCallback } from 'react';
import { 
  addIssue, 
  deleteIssue, 
  getAllIssues as getAllIssuesFromDB, 
  getAllIssueNames as getAllIssueNamesFromDB,
  getIssueByName as getIssueByNameFromDB, 
  updateIssueName as updateIssueNameInDB, 
  addTemplateToIssue,
  removeTemplateFromIssue,
  incrementIssueUsage as incrementIssueUsageInDB,
  decrementIssueUsage as decrementIssueUsageInDB,
  getIssueMetrics as getIssueMetricsFromDB, 
} from '@/app/utils/indexedDB/IssueStorage';
import Issue from '@dataTypes/Issue';
import IssueMetric from '@dataTypes/IssueMetric';

interface UseIssueStorageReturn {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  
  // Operations
  addNewIssue: (issueName: string, templateNames: string[]) => Promise<void>;
  removeExistingIssue: (issueName: string) => Promise<void>;
  getAllIssues: () => Promise<Issue[]>;
  getAllIssueNames: () => Promise<string[]>;
  getIssueByName: (issueName: string) => Promise<Issue | undefined>;
  updateIssueName: (oldName: string, newName: string) => Promise<void>;
  updateTemplateNames: (issueName: string, templateNames: string[]) => Promise<void>;
  addTemplateToExistingIssue: (issueName: string, templateName: string) => Promise<void>;
  removeTemplateFromExistingIssue: (issueName: string, templateName: string) => Promise<void>;
  incrementIssueUsage: (issueName: string) => Promise<void>;
  decrementIssueUsage: (issueName: string) => Promise<void>;
  getIssueMetrics: (issueName: string) => Promise<IssueMetric | undefined>;
  
  // State management
  clearError: () => void;
  refreshIssues: () => Promise<void>;
}

export const useIssueStorage = (): UseIssueStorageReturn => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all issues on mount
  const refreshIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allIssues = await getAllIssuesFromDB();
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
      const metrics: IssueMetric = { usageCount: 0, usagePerDay: 0 };
      await addIssue(issueName, templateNames, metrics);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  const removeExistingIssue = useCallback(async (issueName: string): Promise<void> => {
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

  const getAllIssues = useCallback(async (): Promise<Issue[]> => {
    try {
      setError(null);
      const allIssues = await getAllIssuesFromDB();
      return allIssues;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get issues';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getAllIssueNames = useCallback(async (): Promise<string[]> => {
    try {
      setError(null);
      const issueNames = await getAllIssueNamesFromDB();
      return issueNames;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get issue names';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getIssueByName = useCallback(async (issueName: string): Promise<Issue | undefined> => {
    try {
      setError(null);
      const issue = await getIssueByNameFromDB(issueName);
      return issue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get issue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateIssueName = useCallback(async (oldName: string, newName: string): Promise<void> => {
    try {
      setError(null);
      await updateIssueNameInDB(oldName, newName);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update issue name';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  const updateTemplateNames = useCallback(async (issueName: string, templateNames: string[]): Promise<void> => {
    try {
      setError(null);
      const issue = await getIssueByNameFromDB(issueName);
      if (!issue) {
        throw new Error('Issue not found');
      }
      // First delete the existing issue, then add it back with updated template names
      await deleteIssue(issueName);
      await addIssue(issueName, templateNames, issue.metrics);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template names';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

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

  const incrementIssueUsage = useCallback(async (issueName: string): Promise<void> => {
    try {
      setError(null);
      await incrementIssueUsageInDB(issueName);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to increment issue usage';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  const decrementIssueUsage = useCallback(async (issueName: string): Promise<void> => {
    try {
      setError(null);
      await decrementIssueUsageInDB(issueName);
      await refreshIssues(); // Refresh to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrement issue usage';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshIssues]);

  const getIssueMetrics = useCallback(async (issueName: string): Promise<IssueMetric | undefined> => {
    try {
      setError(null);
      const metrics = await getIssueMetricsFromDB(issueName);
      return metrics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get issue metrics';
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
    removeExistingIssue,
    getAllIssues,
    getAllIssueNames,
    getIssueByName,
    updateIssueName,
    updateTemplateNames,
    addTemplateToExistingIssue,
    removeTemplateFromExistingIssue,
    incrementIssueUsage,
    decrementIssueUsage,
    getIssueMetrics,
    clearError,
    refreshIssues,
  };
};

export default useIssueStorage;
