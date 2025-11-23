import { 
  parseInput, 
  parseCombinedImport, 
  extractDataFromFiles,
  validateIssueJson, 
  validateTemplateJson, 
  validateIssueArray,
  validateTemplateArray,
  validateExportedIssueData,
  validateExportedTemplateData,
  validateCombinedExportData,
  confirmMatchingTemplates 
} from "../src/app/utils/parseInput";
import { describe, expect, test } from '@jest/globals'
import * as fs from 'fs';
import * as path from 'path';

// Read legacy test data
const issuesBasic = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-basic.txt'), 'utf-8');
const templatesBasic = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-basic.txt'), 'utf-8');

const issuesComprehensive = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-comprehensive.txt'), 'utf-8');
const templatesComprehensive = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-comprehensive.txt'), 'utf-8');

const issuesExtended = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-extended.txt'), 'utf-8');
const templatesExtended = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-extended.txt'), 'utf-8');

const issuesMinimal = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-minimal.txt'), 'utf-8');
const templatesMinimal = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-minimal.txt'), 'utf-8');

// Read new export format test data
const issuesExportFormat = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-export-format.json'), 'utf-8');
const templatesExportFormat = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-export-format.json'), 'utf-8');
const combinedExportComplete = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/combined-export-complete.json'), 'utf-8');

// Read edge case test data
const issuesEmptyExport = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-empty-export.json'), 'utf-8');
const templatesEmptyExport = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-empty-export.json'), 'utf-8');
const combinedInvalidReferences = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/combined-export-invalid-references.json'), 'utf-8');
const combinedMalformed = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/combined-export-malformed.json'), 'utf-8');

describe("parseInput Legacy Format Tests", () => {
    test("Basic Issues and templates parsing (legacy format)", () => {
        expect(validateIssueJson(issuesBasic)).toBe(true);
        expect(validateTemplateJson(templatesBasic)).toBe(true);

        const { issues, templates } = parseInput(issuesBasic, templatesBasic);
        expect(issues.length).toBeGreaterThan(0);
        expect(templates.length).toBeGreaterThan(0);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test("Comprehensive Issues and templates parsing (legacy format)", () => {
        expect(validateIssueJson(issuesComprehensive)).toBe(true);
        expect(validateTemplateJson(templatesComprehensive)).toBe(true);

        const { issues, templates } = parseInput(issuesComprehensive, templatesComprehensive);
        expect(issues.length).toBeGreaterThan(0);
        expect(templates.length).toBeGreaterThan(0);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test("Extended Issues and templates parsing (legacy format)", () => {
        expect(validateIssueJson(issuesExtended)).toBe(true);
        expect(validateTemplateJson(templatesExtended)).toBe(true);

        const { issues, templates } = parseInput(issuesExtended, templatesExtended);
        expect(issues.length).toBeGreaterThan(0);
        expect(templates.length).toBeGreaterThan(0);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test("Minimal Issues and templates parsing (legacy format)", () => {
        expect(validateIssueJson(issuesMinimal)).toBe(true);
        expect(validateTemplateJson(templatesMinimal)).toBe(true);

        const { issues, templates } = parseInput(issuesMinimal, templatesMinimal);
        expect(issues.length).toBeGreaterThan(0);
        expect(templates.length).toBeGreaterThan(0);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });
});

describe("parseInput Export Format Tests", () => {
    test("New export format validation", () => {
        expect(validateIssueJson(issuesExportFormat)).toBe(true);
        expect(validateTemplateJson(templatesExportFormat)).toBe(true);
        expect(validateCombinedExportData(JSON.parse(combinedExportComplete))).toBe(true);
    });

    test("Parse issues and templates in new export format", () => {
        const { issues, templates } = parseInput(issuesExportFormat, templatesExportFormat);
        
        expect(issues.length).toBe(6);
        expect(templates.length).toBe(18);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);

        // Verify specific data structure
        const passwordResetIssue = issues.find(i => i.name === "Password Reset");
        expect(passwordResetIssue).toBeDefined();
        expect(passwordResetIssue?.templateNames).toContain("Basic Password Reset");
        expect(passwordResetIssue?.templateNames).toContain("Security Questions Reset");
        expect(passwordResetIssue?.templateNames).toContain("Multi-Factor Reset");

        const basicTemplate = templates.find(t => t.name === "Basic Password Reset");
        expect(basicTemplate).toBeDefined();
        expect(basicTemplate?.issue).toBe("Password Reset");
        expect(basicTemplate?.fields).toBeDefined();
    });

    test("Parse combined export format", () => {
        const { issues, templates } = parseCombinedImport(combinedExportComplete);
        
        expect(issues.length).toBe(6);
        expect(templates.length).toBe(18);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);

        // Verify metadata is handled correctly
        const combinedData = JSON.parse(combinedExportComplete);
        expect(combinedData.totalIssues).toBe(6);
        expect(combinedData.totalTemplates).toBe(18);
        expect(combinedData.exportDate).toBeDefined();
    });

    test("Extract data from files handles both formats", () => {
        // Test legacy format
        const { issues: legacyIssues, templates: legacyTemplates } = extractDataFromFiles(issuesBasic, templatesBasic);
        expect(legacyIssues.length).toBeGreaterThan(0);
        expect(legacyTemplates.length).toBeGreaterThan(0);

        // Test export format
        const { issues: exportIssues, templates: exportTemplates } = extractDataFromFiles(issuesExportFormat, templatesExportFormat);
        expect(exportIssues.length).toBe(6);
        expect(exportTemplates.length).toBe(18);
    });
});

describe("Validation Function Tests", () => {
    test("Array validation functions", () => {
        const issuesArray = JSON.parse(issuesBasic);
        const templatesArray = JSON.parse(templatesBasic);
        
        expect(validateIssueArray(issuesArray)).toBe(true);
        expect(validateTemplateArray(templatesArray)).toBe(true);
    });

    test("Export data validation functions", () => {
        const exportedIssues = JSON.parse(issuesExportFormat);
        const exportedTemplates = JSON.parse(templatesExportFormat);
        
        expect(validateExportedIssueData(exportedIssues)).toBe(true);
        expect(validateExportedTemplateData(exportedTemplates)).toBe(true);
    });

    test("Combined export validation", () => {
        const combinedData = JSON.parse(combinedExportComplete);
        expect(validateCombinedExportData(combinedData)).toBe(true);
    });

    test("Invalid data validation", () => {
        // Test malformed combined export
        const malformedData = JSON.parse(combinedMalformed);
        expect(validateCombinedExportData(malformedData)).toBe(false);

        // Test invalid array formats
        expect(validateIssueArray([{ name: "test" }])).toBe(false); // missing templateNames
        expect(validateTemplateArray([{ name: "test" }])).toBe(false); // missing required fields
    });
});

describe("Edge Cases and Error Handling", () => {
    test("Empty export data", () => {
        expect(validateIssueJson(issuesEmptyExport)).toBe(true);
        expect(validateTemplateJson(templatesEmptyExport)).toBe(true);

        const { issues, templates } = parseInput(issuesEmptyExport, templatesEmptyExport);
        expect(issues.length).toBe(0);
        expect(templates.length).toBe(0);
    });

    test("Invalid template references", () => {
        expect(() => parseCombinedImport(combinedInvalidReferences)).toThrow("Mismatch between issues and templates");
    });

    test("Malformed export data", () => {
        expect(() => parseCombinedImport(combinedMalformed)).toThrow("Invalid combined export data format");
    });

    test("Invalid JSON", () => {
        expect(() => parseInput("invalid json", templatesBasic)).toThrow();
        expect(() => parseInput(issuesBasic, "invalid json")).toThrow();
        expect(() => parseCombinedImport("invalid json")).toThrow();
    });

    test("Mixed format compatibility", () => {
        // Test extractDataFromFiles can handle mixed formats (doesn't validate matching)
        const { issues: legacyIssuesArray } = extractDataFromFiles(issuesBasic, templatesBasic);
        const { templates: exportTemplatesArray } = extractDataFromFiles(issuesExportFormat, templatesExportFormat);
        
        expect(legacyIssuesArray.length).toBeGreaterThan(0);
        expect(exportTemplatesArray.length).toBeGreaterThan(0);

        // Test that both legacy and export formats can be parsed individually
        expect(() => parseInput(issuesBasic, templatesBasic)).not.toThrow();
        expect(() => parseInput(issuesExportFormat, templatesExportFormat)).not.toThrow();

        // Test that validation works for both formats
        expect(validateIssueJson(issuesBasic)).toBe(true);
        expect(validateIssueJson(issuesExportFormat)).toBe(true);
        expect(validateTemplateJson(templatesBasic)).toBe(true);
        expect(validateTemplateJson(templatesExportFormat)).toBe(true);
    });
});

describe("Data Integrity Tests", () => {
    test("All template names in issues exist in templates", () => {
        const { issues, templates } = parseInput(issuesExportFormat, templatesExportFormat);
        
        for (const issue of issues) {
            for (const templateName of issue.templateNames) {
                const matchingTemplate = templates.find(t => t.name === templateName);
                expect(matchingTemplate).toBeDefined();
                expect(matchingTemplate?.issue).toBe(issue.name);
            }
        }
    });

    test("All templates reference valid issues", () => {
        const { issues, templates } = parseInput(issuesExportFormat, templatesExportFormat);
        
        for (const template of templates) {
            const matchingIssue = issues.find(i => i.name === template.issue);
            expect(matchingIssue).toBeDefined();
            expect(matchingIssue?.templateNames).toContain(template.name);
        }
    });

    test("Export metadata accuracy", () => {
        const combinedData = JSON.parse(combinedExportComplete);
        
        expect(combinedData.issues.length).toBe(combinedData.totalIssues);
        expect(combinedData.templates.length).toBe(combinedData.totalTemplates);
        expect(new Date(combinedData.exportDate)).toBeInstanceOf(Date);
    });
});