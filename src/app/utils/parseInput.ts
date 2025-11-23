import Template from "@dataTypes/Template";
import Issue from "@dataTypes/Issue";

// Interface for exported data with metadata
interface ExportedData {
  exportDate?: string;
  totalIssues?: number;
  totalTemplates?: number;
  issues?: Issue[];
  templates?: Template[];
}

// Interface for combined export format
interface CombinedExportData {
  exportDate: string;
  totalIssues: number;
  totalTemplates: number;
  issues: Issue[];
  templates: Template[];
}

export function parseInput(issueText: string, templateText: string) {
    const { issues, templates } = extractDataFromFiles(issueText, templateText);
    
    if (!confirmMatchingTemplates(issues, templates)) {
        throw new Error("Mismatch between issues and templates");
    }

    return { issues, templates };
}

// New function to handle both legacy and metadata formats
export function extractDataFromFiles(issueText: string, templateText: string) {
    let issues: Issue[] = [];
    let templates: Template[] = [];

    // Handle issues file
    const issueData = JSON.parse(issueText);
    if (Array.isArray(issueData)) {
        // Legacy format - direct array
        if (!validateIssueArray(issueData)) {
            throw new Error("Invalid issue array format");
        }
        issues = issueData;
    } else if (issueData.issues) {
        // New metadata format
        if (!validateExportedIssueData(issueData)) {
            throw new Error("Invalid exported issue data format");
        }
        issues = issueData.issues;
    } else {
        throw new Error("Unrecognized issue file format");
    }

    // Handle templates file
    const templateData = JSON.parse(templateText);
    if (Array.isArray(templateData)) {
        // Legacy format - direct array
        if (!validateTemplateArray(templateData)) {
            throw new Error("Invalid template array format");
        }
        templates = templateData;
    } else if (templateData.templates) {
        // New metadata format
        if (!validateExportedTemplateData(templateData)) {
            throw new Error("Invalid exported template data format");
        }
        templates = templateData.templates;
    } else {
        throw new Error("Unrecognized template file format");
    }

    return { issues, templates };
}

// New function to handle combined export format
export function parseCombinedImport(combinedText: string) {
    const data: CombinedExportData = JSON.parse(combinedText);
    
    if (!validateCombinedExportData(data)) {
        throw new Error("Invalid combined export data format");
    }

    if (!confirmMatchingTemplates(data.issues, data.templates)) {
        throw new Error("Mismatch between issues and templates");
    }

    return { issues: data.issues, templates: data.templates };
}

// Validate issue array (legacy format)
export function validateIssueArray(issues: any[]): boolean {
    try {
        for (const issue of issues) {
            if (typeof issue.name !== 'string' || !Array.isArray(issue.templateNames)) {
                return false;
            }
            for (const templateName of issue.templateNames) {
                if (typeof templateName !== 'string') {
                    return false;
                }
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

// Validate template array (legacy format)
export function validateTemplateArray(templates: any[]): boolean {
    try {
        for (const template of templates) {
            if (typeof template.issue !== 'string' || 
                typeof template.name !== 'string' || 
                typeof template.kba !== 'string' || 
                !Array.isArray(template.fields)) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

// Validate exported issue data with metadata
export function validateExportedIssueData(data: any): boolean {
    try {
        if (!data.issues || !Array.isArray(data.issues)) {
            return false;
        }
        return validateIssueArray(data.issues);
    } catch (e) {
        return false;
    }
}

// Validate exported template data with metadata
export function validateExportedTemplateData(data: any): boolean {
    try {
        if (!data.templates || !Array.isArray(data.templates)) {
            return false;
        }
        return validateTemplateArray(data.templates);
    } catch (e) {
        return false;
    }
}

// Validate combined export data
export function validateCombinedExportData(data: any): boolean {
    try {
        if (!data.issues || !Array.isArray(data.issues) ||
            !data.templates || !Array.isArray(data.templates)) {
            return false;
        }
        return validateIssueArray(data.issues) && validateTemplateArray(data.templates);
    } catch (e) {
        return false;
    }
}

// Legacy validation functions for backward compatibility
export function validateIssueJson(issueText: string): boolean {
    try {
        const data = JSON.parse(issueText);
        if (Array.isArray(data)) {
            return validateIssueArray(data);
        } else {
            return validateExportedIssueData(data);
        }
    } catch (e) {
        return false;
    }
}

export function validateTemplateJson(templateText: string): boolean {
    try {
        const data = JSON.parse(templateText);
        if (Array.isArray(data)) {
            return validateTemplateArray(data);
        } else {
            return validateExportedTemplateData(data);
        }
    } catch (e) {
        return false;
    }
}

export function confirmMatchingTemplates(issues: Issue[], templates: Template[]) : boolean {
    for (const issue of issues) {
        const issueName = issue.name;
        const templateNames = issue.templateNames;

        for (const templateName of templateNames) {
            const matchingTemplate = templates.find(t => t.name === templateName);
            if (!matchingTemplate) {
                console.error(`No matching template found for template name: ${templateName} in issue: ${issueName}`);
                return false;
            }

            if (matchingTemplate.issue !== issueName) {
                console.error(`Template issue mismatch for template name: ${templateName}. Expected issue: ${issueName}, found: ${matchingTemplate.issue}`);
                return false;
            }
        }
    }
    return true;
}