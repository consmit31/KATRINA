import TemplateField from '../src/app/dataTypes/TemplateField';
import { userIdFieldToPopulate, nameFieldToPopulate, emailFieldToPopulate, phoneFieldToPopulate } from '../src/app/utils/populateFromContactInfo';
import * as CustomFieldLabelsStorage from '../src/app/utils/indexedDB/CustomFieldLabelsStorage';

// Mock the IndexedDB storage module
jest.mock('../src/app/utils/indexedDB/CustomFieldLabelsStorage');

describe('populateFromContactInfo with IndexedDB', () => {
  const mockTemplateFields: TemplateField[] = [
    { label: 'Customer ID', value: '', type: 'text' },
    { label: 'Full Name', value: '', type: 'text' },
    { label: 'Email Address', value: '', type: 'text' },
    { label: 'Phone Number', value: '', type: 'text' },
    { label: 'Other Field', value: '', type: 'text' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('userIdFieldToPopulate works with custom labels from IndexedDB', async () => {
    const mockGetFieldLabels = jest.spyOn(CustomFieldLabelsStorage, 'getFieldLabels');
    mockGetFieldLabels.mockResolvedValue(['Customer ID', 'Client ID']);

    const result = await userIdFieldToPopulate(mockTemplateFields);
    expect(result).toBe('Customer ID');
    expect(mockGetFieldLabels).toHaveBeenCalledWith('userIdLabels');
  });

  test('nameFieldToPopulate works with custom labels from IndexedDB', async () => {
    const mockGetFieldLabels = jest.spyOn(CustomFieldLabelsStorage, 'getFieldLabels');
    mockGetFieldLabels.mockResolvedValue(['Full Name', 'Customer Name']);

    const result = await nameFieldToPopulate(mockTemplateFields);
    expect(result).toBe('Full Name');
    expect(mockGetFieldLabels).toHaveBeenCalledWith('nameLabels');
  });

  test('emailFieldToPopulate works with custom labels from IndexedDB', async () => {
    const mockGetFieldLabels = jest.spyOn(CustomFieldLabelsStorage, 'getFieldLabels');
    mockGetFieldLabels.mockResolvedValue(['Email Address', 'Contact Email']);

    const result = await emailFieldToPopulate(mockTemplateFields);
    expect(result).toBe('Email Address');
    expect(mockGetFieldLabels).toHaveBeenCalledWith('emailLabels');
  });

  test('phoneFieldToPopulate works with custom labels from IndexedDB', async () => {
    const mockGetFieldLabels = jest.spyOn(CustomFieldLabelsStorage, 'getFieldLabels');
    mockGetFieldLabels.mockResolvedValue(['Phone Number', 'Contact Phone']);

    const result = await phoneFieldToPopulate(mockTemplateFields);
    expect(result).toBe('Phone Number');
    expect(mockGetFieldLabels).toHaveBeenCalledWith('phoneLabels');
  });

  test('returns null when no matching labels found', async () => {
    const mockGetFieldLabels = jest.spyOn(CustomFieldLabelsStorage, 'getFieldLabels');
    mockGetFieldLabels.mockResolvedValue(['Non-existent Label']);

    const result = await userIdFieldToPopulate(mockTemplateFields);
    expect(result).toBeNull();
  });

  test('returns first matching label when multiple matches exist', async () => {
    const fieldsWithMultipleMatches: TemplateField[] = [
      { label: 'User ID', value: '', type: 'text' },
      { label: 'Customer ID', value: '', type: 'text' },
      { label: 'Other Field', value: '', type: 'text' }
    ];
    
    const mockGetFieldLabels = jest.spyOn(CustomFieldLabelsStorage, 'getFieldLabels');
    mockGetFieldLabels.mockResolvedValue(['Customer ID', 'User ID']);

    const result = await userIdFieldToPopulate(fieldsWithMultipleMatches);
    expect(result).toBe('User ID'); // Should return the first field that matches any label
  });
});