import Template from "@dataTypes/Template";
import Issue from "@dataTypes/Issue";
import IssueMetric from "@dataTypes/IssueMetric";
import TemplateMetric from "@dataTypes/TemplateMetric";

// Helper functions to ensure default metrics
function ensureIssueMetrics(issue: any): Issue {
  const defaultMetrics: IssueMetric = {
    usageCount: 0,
    usagePerDay: 0
  };
  
  return {
    ...issue,
    metrics: issue.metrics || defaultMetrics
  };
}

function ensureTemplateMetrics(template: any): Template {
  const defaultMetrics: TemplateMetric = {
    usageCount: 0,
    usagePerDay: 0,
    commonWorkLog: []
  };
  
  return {
    ...template,
    metrics: template.metrics || defaultMetrics
  };
}

// Interface for exported data with metadata (removed unused ExportedData)

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
        issues = issueData.map(ensureIssueMetrics);
    } else if (issueData.issues) {
        // New metadata format
        if (!validateExportedIssueData(issueData)) {
            throw new Error("Invalid exported issue data format");
        }
        issues = issueData.issues.map(ensureIssueMetrics);
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
        templates = templateData.map(ensureTemplateMetrics);
    } else if (templateData.templates) {
        // New metadata format
        if (!validateExportedTemplateData(templateData)) {
            throw new Error("Invalid exported template data format");
        }
        templates = templateData.templates.map(ensureTemplateMetrics);
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

    const issuesWithMetrics = data.issues.map(ensureIssueMetrics);
    const templatesWithMetrics = data.templates.map(ensureTemplateMetrics);

    if (!confirmMatchingTemplates(issuesWithMetrics, templatesWithMetrics)) {
        throw new Error("Mismatch between issues and templates");
    }

    return { issues: issuesWithMetrics, templates: templatesWithMetrics };
}

// Validate issue array (legacy format)
export function validateIssueArray(issues: unknown[]): boolean {
    try {
        for (const issue of issues) {
            if (typeof issue !== 'object' || issue === null) {
                return false;
            }
            const issueObj = issue as Record<string, unknown>;
            if (typeof issueObj.name !== 'string' || !Array.isArray(issueObj.templateNames)) {
                return false;
            }
            for (const templateName of issueObj.templateNames) {
                if (typeof templateName !== 'string') {
                    return false;
                }
            }
        }
        return true;
    } catch {
        return false;
    }
}

// Validate template array (legacy format)
export function validateTemplateArray(templates: unknown[]): boolean {
    try {
        for (const template of templates) {
            if (typeof template !== 'object' || template === null) {
                return false;
            }
            const templateObj = template as Record<string, unknown>;
            if (typeof templateObj.issue !== 'string' || 
                typeof templateObj.name !== 'string' || 
                typeof templateObj.kba !== 'string' || 
                !Array.isArray(templateObj.fields)) {
                return false;
            }
        }
        return true;
    } catch {
        return false;
    }
}

// Validate exported issue data with metadata
export function validateExportedIssueData(data: unknown): boolean {
    try {
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        const dataObj = data as Record<string, unknown>;
        if (!dataObj.issues || !Array.isArray(dataObj.issues)) {
            return false;
        }
        return validateIssueArray(dataObj.issues);
    } catch {
        return false;
    }
}

// Validate exported template data with metadata
export function validateExportedTemplateData(data: unknown): boolean {
    try {
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        const dataObj = data as Record<string, unknown>;
        if (!dataObj.templates || !Array.isArray(dataObj.templates)) {
            return false;
        }
        return validateTemplateArray(dataObj.templates);
    } catch {
        return false;
    }
}

// Validate combined export data
export function validateCombinedExportData(data: unknown): boolean {
    try {
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        const dataObj = data as Record<string, unknown>;
        if (!dataObj.issues || !Array.isArray(dataObj.issues) ||
            !dataObj.templates || !Array.isArray(dataObj.templates)) {
            return false;
        }
        return validateIssueArray(dataObj.issues) && validateTemplateArray(dataObj.templates);
    } catch {
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
    } catch {
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
    } catch {
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