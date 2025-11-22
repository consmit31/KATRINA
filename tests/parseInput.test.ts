import { parseInput, validateIssueJson, validateTemplateJson, confirmMatchingTemplates } from "../src/app/utils/parseInput";
import { describe, expect, test } from '@jest/globals'
import * as fs from 'fs';
import * as path from 'path';

// Read test data from external files (not tracked by git)
const issuesBasic = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-basic.txt'), 'utf-8');
const templatesBasic = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-basic.txt'), 'utf-8');

const issuesComprehensive = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-comprehensive.txt'), 'utf-8');
const templatesComprehensive = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-comprehensive.txt'), 'utf-8');

const issuesExtended = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-extended.txt'), 'utf-8');
const templatesExtended = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-extended.txt'), 'utf-8');

const issuesMinimal = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/issues-minimal.txt'), 'utf-8');
const templatesMinimal = fs.readFileSync(path.join(__dirname, '../test-data/parseInputData/templates-minimal.txt'), 'utf-8');

describe("parseInput Tests", () => {
    test("Basic Issues and templates parsing", () => {
        expect(validateIssueJson(issuesBasic)).toBe(true);
        expect(validateTemplateJson(templatesBasic)).toBe(true);

        // parse issues basic text to Issue[]
        const issues: any[] = JSON.parse(issuesBasic);
        const templates: any[] = JSON.parse(templatesBasic);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test("Comprehensive Issues and templates parsing", () => {
        expect(validateIssueJson(issuesComprehensive)).toBe(true);
        expect(validateTemplateJson(templatesComprehensive)).toBe(true);

        // parse issues comprehensive text to Issue[]
        const issues: any[] = JSON.parse(issuesComprehensive);
        const templates: any[] = JSON.parse(templatesComprehensive);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test("Extended Issues and templates parsing", () => {
        expect(validateIssueJson(issuesExtended)).toBe(true);
        expect(validateTemplateJson(templatesExtended)).toBe(true);

        // parse issues extended text to Issue[]
        const issues: any[] = JSON.parse(issuesExtended);
        const templates: any[] = JSON.parse(templatesExtended);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });

    test("Minimal Issues and templates parsing", () => {
        expect(validateIssueJson(issuesMinimal)).toBe(true);
        expect(validateTemplateJson(templatesMinimal)).toBe(true);

        // parse issues minimal text to Issue[]
        const issues: any[] = JSON.parse(issuesMinimal);
        const templates: any[] = JSON.parse(templatesMinimal);
        expect(confirmMatchingTemplates(issues, templates)).toBe(true);
    });


});