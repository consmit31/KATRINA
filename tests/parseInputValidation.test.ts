import { parseInput, validateIssueJson, validateTemplateJson, confirmMatchingTemplates } from '../src/app/utils/parseInput';
import { describe, expect, test } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import Issue from '../src/app/dataTypes/Issue';
import Template from '../src/app/dataTypes/Template';

describe('parseInput with test data', () => {
  const testDataPath = join(process.cwd(), 'test-data', 'parseInputData');
  
  // Helper function to read test files
  const readTestFile = (filename: string): string => {
    return readFileSync(join(testDataPath, filename), 'utf-8');
  };

  describe('Basic test data', () => {
    const issuesText = readTestFile('issues-basic.txt');
    const templatesText = readTestFile('templates-basic.txt');

    test('validates basic issues JSON correctly', () => {
      expect(validateIssueJson(issuesText)).toBe(true);
    });

    test('validates basic templates JSON correctly', () => {
      expect(validateTemplateJson(templatesText)).toBe(true);
    });

    test('parses basic test data successfully', () => {
      const result = parseInput(issuesText, templatesText);
      
      expect(result.issues).toHaveLength(4);
      expect(result.templates).toHaveLength(8);
      
      // Check specific issues
      expect(result.issues.find(i => i.name === 'Password Reset')).toBeDefined();
      expect(result.issues.find(i => i.name === 'Account Lockout')).toBeDefined();
      expect(result.issues.find(i => i.name === 'Login Issues')).toBeDefined();
      expect(result.issues.find(i => i.name === 'Smart Device Setup')).toBeDefined();
    });

    test('confirms all template names have matching templates', () => {
      const { issues, templates } = parseInput(issuesText, templatesText);
      expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test('validates template structure for basic data', () => {
      const { templates } = parseInput(issuesText, templatesText);
      
      // Check that templates have required fields
      templates.forEach(template => {
        expect(template).toHaveProperty('issue');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('kba');
        expect(template).toHaveProperty('fields');
        expect(Array.isArray(template.fields)).toBe(true);
        
        // Check field structure
        template.fields.forEach(field => {
          expect(field).toHaveProperty('type');
          expect(field).toHaveProperty('label');
          expect(['text', 'selector'].includes(field.type)).toBe(true);
          
          if (field.type === 'selector') {
            expect(field).toHaveProperty('allowCustom');
            expect(field).toHaveProperty('options');
            expect(Array.isArray(field.options)).toBe(true);
          }
        });
      });
    });
  });

  describe('Extended test data', () => {
    const issuesText = readTestFile('issues-extended.txt');
    const templatesText = readTestFile('templates-extended.txt');

    test('parses extended test data successfully', () => {
      const result = parseInput(issuesText, templatesText);
      
      expect(result.issues).toHaveLength(3);
      expect(result.templates).toHaveLength(9);
      
      // Check specific issues
      expect(result.issues.find(i => i.name === 'Account Security')).toBeDefined();
      expect(result.issues.find(i => i.name === 'Technical Support')).toBeDefined();
      expect(result.issues.find(i => i.name === 'Data Management')).toBeDefined();
    });

    test('confirms all template names have matching templates', () => {
      const { issues, templates } = parseInput(issuesText, templatesText);
      expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });
  });

  describe('Minimal test data', () => {
    const issuesText = readTestFile('issues-minimal.txt');
    const templatesText = readTestFile('templates-minimal.txt');

    test('parses minimal test data successfully', () => {
      const result = parseInput(issuesText, templatesText);
      
      expect(result.issues).toHaveLength(1);
      expect(result.templates).toHaveLength(1);
      
      // Check specific issue
      const issue = result.issues[0];
      expect(issue.name).toBe('Emergency Access');
      expect(issue.templateNames).toEqual(['Account Recovery Emergency']);
      
      // Check specific template
      const template = result.templates[0];
      expect(template.name).toBe('Account Recovery Emergency');
      expect(template.issue).toBe('Emergency Access');
    });

    test('confirms template name matches', () => {
      const { issues, templates } = parseInput(issuesText, templatesText);
      expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });
  });

  describe('Comprehensive test data', () => {
    const issuesText = readTestFile('issues-comprehensive.txt');
    const templatesText = readTestFile('templates-comprehensive.txt');

    test('parses comprehensive test data successfully', () => {
      const result = parseInput(issuesText, templatesText);
      
      expect(result.issues).toHaveLength(3);
      expect(result.templates).toHaveLength(15); // 5 + 6 + 4
      
      // Check System Administration templates
      const sysAdminTemplates = result.templates.filter(t => t.issue === 'System Administration');
      expect(sysAdminTemplates).toHaveLength(5);
      
      // Check Help Desk templates
      const helpDeskTemplates = result.templates.filter(t => t.issue === 'Help Desk');
      expect(helpDeskTemplates).toHaveLength(6);
      
      // Check Compliance templates
      const complianceTemplates = result.templates.filter(t => t.issue === 'Compliance');
      expect(complianceTemplates).toHaveLength(4);
    });

    test('confirms all template names have matching templates', () => {
      const { issues, templates } = parseInput(issuesText, templatesText);
      expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('throws error for invalid issue JSON', () => {
      const invalidIssueJson = '{"invalid": "json"}';
      const validTemplateJson = readTestFile('templates-minimal.txt');
      
      expect(() => parseInput(invalidIssueJson, validTemplateJson)).toThrow('Invalid issue JSON format');
    });

    test('throws error for invalid template JSON', () => {
      const validIssueJson = readTestFile('issues-minimal.txt');
      const invalidTemplateJson = 'invalid json';
      
      expect(() => parseInput(validIssueJson, invalidTemplateJson)).toThrow('Invalid template JSON format');
    });

    test('throws error for mismatched templates', () => {
      const issueWithMismatch = '[{"name": "Test Issue", "templateNames": ["Nonexistent Template"]}]';
      const emptyTemplates = '[]';
      
      expect(() => parseInput(issueWithMismatch, emptyTemplates)).toThrow('Mismatch between issues and templates');
    });

    test('validates issue structure', () => {
      const invalidIssueStructure = '[{"name": 123, "templateNames": "not an array"}]';
      expect(validateIssueJson(invalidIssueStructure)).toBe(false);
    });

    test('validates template array structure', () => {
      const notAnArray = '{"single": "object"}';
      expect(validateTemplateJson(notAnArray)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    test('handles empty arrays', () => {
      const emptyIssues = '[]';
      const emptyTemplates = '[]';
      
      const result = parseInput(emptyIssues, emptyTemplates);
      expect(result.issues).toHaveLength(0);
      expect(result.templates).toHaveLength(0);
    });

    test('handles issues with empty templateNames', () => {
      const issueWithEmptyTemplates = '[{"name": "Empty Issue", "templateNames": []}]';
      const emptyTemplates = '[]';
      
      expect(() => parseInput(issueWithEmptyTemplates, emptyTemplates)).not.toThrow();
    });

    test('detects template name conflicts across different issues', () => {
      const multipleIssues = `[
        {"name": "Issue 1", "templateNames": ["Shared Template"]},
        {"name": "Issue 2", "templateNames": ["Shared Template"]}
      ]`;
      const conflictingTemplates = `[
        {"issue": "Issue 1", "name": "Shared Template", "kba": "Test", "fields": []},
        {"issue": "Issue 2", "name": "Shared Template", "kba": "Test", "fields": []}
      ]`;
      
      // This should throw because template "Shared Template" cannot belong to both issues
      expect(() => parseInput(multipleIssues, conflictingTemplates)).toThrow();
    });
  });
});