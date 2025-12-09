import { processRainMeterContent, findBestFieldMatch, populateTemplateFields } from '../src/app/utils/populateFromMisc';
import TemplateField from '../src/app/dataTypes/TemplateField';

// Mock the RainMeterMatchStorage module
jest.mock('../src/app/utils/indexedDB/RainMeterMatchStorage', () => ({
  getRainMeterMatchConfig: jest.fn().mockResolvedValue({
    workstation: {
      name: "Workstation",
      configKey: "workstation",
      pattern: /^[TW][A-Z0-9]{10,12}$/,
      fields: ["Workstation", "Workstation Name", "PC Name", "Computer Name"]
    },
    ipAddress: {
      name: "IP Address", 
      configKey: "ipAddress",
      pattern: /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3})$/,
      fields: ["IP Address", "IP", "Network IP", "Local IP"]
    }
  })
}));

describe('RainMeter Pattern Matching', () => {
  const mockTemplateFields: TemplateField[] = [
    { type: 'text', label: 'Workstation', value: '' },
    { type: 'text', label: 'IP Address', value: '' },
    { type: 'text', label: 'User Name', value: '' }
  ];

  describe('processRainMeterContent', () => {
    it('should match workstation pattern', async () => {
      const content = 'TH123456789A\n192.168.1.100\nSome other text';
      const matches = await processRainMeterContent(content);
      
      expect(matches).toHaveLength(2);
      expect(matches[0]).toEqual({
        value: 'TH123456789A',
        parameterName: 'Workstation',
        configKey: 'workstation',
        matchedFieldLabels: ["Workstation", "Workstation Name", "PC Name", "Computer Name"]
      });
      expect(matches[1]).toEqual({
        value: '192.168.1.100',
        parameterName: 'IP Address',
        configKey: 'ipAddress', 
        matchedFieldLabels: ["IP Address", "IP", "Network IP", "Local IP"]
      });
    });

    it('should handle empty content', async () => {
      const matches = await processRainMeterContent('');
      expect(matches).toHaveLength(0);
    });

    it('should handle content with no matches', async () => {
      const content = 'Random text\nNo patterns here\n123';
      const matches = await processRainMeterContent(content);
      expect(matches).toHaveLength(0);
    });
  });

  describe('findBestFieldMatch', () => {
    it('should find exact match', () => {
      const matchedLabels = ["Workstation", "PC Name"];
      const result = findBestFieldMatch(mockTemplateFields, matchedLabels);
      expect(result).toBe('Workstation');
    });

    it('should find partial match', () => {
      const mockFields: TemplateField[] = [
        { type: 'text', label: 'Computer Workstation', value: '' }
      ];
      const matchedLabels = ["Workstation"];
      const result = findBestFieldMatch(mockFields, matchedLabels);
      expect(result).toBe('Computer Workstation');
    });

    it('should return null if no match', () => {
      const matchedLabels = ["NonexistentField"];
      const result = findBestFieldMatch(mockTemplateFields, matchedLabels);
      expect(result).toBeNull();
    });
  });

  describe('populateTemplateFields', () => {
    it('should populate empty fields', () => {
      const mockUpdateCallback = jest.fn();
      const matches = [{
        value: 'TH123456789A',
        parameterName: 'Workstation',
        configKey: 'workstation' as const,
        matchedFieldLabels: ["Workstation"]
      }];

      const updates = populateTemplateFields(matches, mockTemplateFields, mockUpdateCallback);
      
      expect(updates).toHaveLength(1);
      expect(updates[0]).toEqual({
        fieldLabel: 'Workstation',
        value: 'TH123456789A',
        parameterName: 'Workstation'
      });
      expect(mockUpdateCallback).toHaveBeenCalledWith('Workstation', 'TH123456789A');
    });

    it('should not overwrite existing field values', () => {
      const fieldsWithValues: TemplateField[] = [
        { type: 'text', label: 'Workstation', value: 'ExistingValue' }
      ];
      const mockUpdateCallback = jest.fn();
      const matches = [{
        value: 'TH123456789A',
        parameterName: 'Workstation',
        configKey: 'workstation' as const,
        matchedFieldLabels: ["Workstation"]
      }];

      const updates = populateTemplateFields(matches, fieldsWithValues, mockUpdateCallback);
      
      expect(updates).toHaveLength(0);
      expect(mockUpdateCallback).not.toHaveBeenCalled();
    });
  });
});