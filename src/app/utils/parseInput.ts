import Template from "@dataTypes/Template";
import Issue from "@dataTypes/Issue";

export function parseInput(issueText: string, templateText: string) {}

export function validateIssueJson(issueText: string) : boolean {
    try {
        const issues = JSON.parse(issueText);
        if (!Array.isArray(issues)) {
            return false;
        }
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

export function validateTemplateJson(templateText: string) : boolean  {
    try {
        const templates = JSON.parse(templateText);
        if (!Array.isArray(templates)) {
            throw Error("Not an array not an array of templates");
        }

        return true;
    } catch (e) {
        console.error(e);
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