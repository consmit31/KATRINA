import { useIssueStorage } from '../src/app/hooks/useIssueStorage';
import { renderHook, act } from '@testing-library/react';

// Mock IndexedDB for testing
const mockIDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIDB,
  writable: true,
});

// Mock the database operations
jest.mock('../src/app/utils/indexedDB/IssueStorage', () => ({
  addIssue: jest.fn().mockResolvedValue(undefined),
  getAllIssues: jest.fn().mockResolvedValue([]),
  getIssueByName: jest.fn().mockResolvedValue(undefined), // Simulate non-existent issue
  updateIssue: jest.fn().mockResolvedValue(undefined),
  deleteIssue: jest.fn().mockResolvedValue(undefined),
  addTemplateToIssue: jest.fn().mockResolvedValue(undefined),
  removeTemplateFromIssue: jest.fn().mockResolvedValue(undefined),
  getTemplateNamesForIssue: jest.fn().mockResolvedValue([]),
  getAllIssueNames: jest.fn().mockResolvedValue([]),
}));

describe('NewTemplateModal Issue Creation Fix', () => {
  test('should create new issue when template is added to non-existent issue', async () => {
    const { result } = renderHook(() => useIssueStorage());
    
    // Wait for initial loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    
    // Test getting a non-existent issue returns undefined
    await act(async () => {
      const issue = await result.current.getIssue('Non-existent Issue');
      expect(issue).toBeUndefined();
    });

    // Test adding a new issue works correctly
    await act(async () => {
      await result.current.addNewIssue('New Issue', ['Template 1']);
    });

    expect(result.current.error).toBeNull();
  });

  test('should add template to existing issue when issue exists', async () => {
    const { result } = renderHook(() => useIssueStorage());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Mock an existing issue
    const mockGetIssueByName = require('../src/app/utils/indexedDB/IssueStorage').getIssueByName;
    mockGetIssueByName.mockResolvedValueOnce({
      name: 'Existing Issue',
      templateNames: ['Existing Template']
    });

    // Test getting an existing issue
    await act(async () => {
      const issue = await result.current.getIssue('Existing Issue');
      expect(issue).toBeDefined();
      expect(issue?.name).toBe('Existing Issue');
    });

    // Test adding template to existing issue
    await act(async () => {
      await result.current.addTemplateToExistingIssue('Existing Issue', 'New Template');
    });

    expect(result.current.error).toBeNull();
  });
});