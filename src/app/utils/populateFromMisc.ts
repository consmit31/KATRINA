import { getRainMeterMatchConfig, RainMeterMatchConfig } from './indexedDB/RainMeterMatchStorage';
import TemplateField from '../dataTypes/TemplateField';

export interface MiscMatchResult {
    value: string;
    parameterName: string;
    configKey: keyof RainMeterMatchConfig;
    matchedFieldLabels: string[];
}

/**
 * Processes pasted content line by line, testing each against RainMeter regex patterns
 * @param content - The pasted content to process
 * @returns Array of matches with their corresponding field labels
 */
export async function processRainMeterContent(content: string): Promise<MiscMatchResult[]> {
    try {
        const config = await getRainMeterMatchConfig();
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const matches: MiscMatchResult[] = [];

        console.log('Processing RainMeter content with config:', config);

        for (const line of lines) {
            console.log(`Testing line: "${line}"`);
            // Test line against each parameter's regex pattern
            for (const [configKey, parameter] of Object.entries(config) as [keyof RainMeterMatchConfig, typeof config[keyof RainMeterMatchConfig]][]) {
                console.log(`Testing against ${parameter.name} pattern:`, parameter.pattern);
                
                if (!parameter.pattern || typeof parameter.pattern.test !== 'function') {
                    console.error(`Invalid pattern for ${parameter.name}:`, parameter.pattern);
                    continue;
                }
                
                if (parameter.pattern.test(line)) {
                    console.log(`Match found: ${line} matches ${parameter.name}`);
                    matches.push({
                        value: line,
                        parameterName: parameter.name,
                        configKey: configKey,
                        matchedFieldLabels: parameter.fields
                    });
                    break; // Stop at first match to avoid duplicate matches
                }
            }
        }

        console.log('Processing complete. Matches found:', matches);
        return matches;
    } catch (error) {
        console.error('Failed to process RainMeter content:', error);
        return [];
    }
}

/**
 * Finds the best field label to populate based on available template fields
 * @param templateFields - Available template fields
 * @param matchedFieldLabels - Possible field labels from RainMeter config
 * @returns The best matching field label or null if none found
 */
export function findBestFieldMatch(templateFields: TemplateField[], matchedFieldLabels: string[]): string | null {
    // Look for exact matches first
    for (const fieldLabel of matchedFieldLabels) {
        const exactMatch = templateFields.find(field => 
            field.label.toLowerCase() === fieldLabel.toLowerCase()
        );
        if (exactMatch) {
            return exactMatch.label;
        }
    }

    // Look for partial matches (field contains one of the matched labels)
    for (const fieldLabel of matchedFieldLabels) {
        const partialMatch = templateFields.find(field => 
            field.label.toLowerCase().includes(fieldLabel.toLowerCase()) ||
            fieldLabel.toLowerCase().includes(field.label.toLowerCase())
        );
        if (partialMatch) {
            return partialMatch.label;
        }
    }

    return null;
}

/**
 * Populates template fields based on RainMeter content matches
 * @param matches - Array of RainMeter matches
 * @param templateFields - Available template fields
 * @param updateFieldCallback - Callback to update field values
 * @returns Array of successful field updates
 */
export function populateTemplateFields(
    matches: MiscMatchResult[],
    templateFields: TemplateField[],
    updateFieldCallback: (label: string, value: string) => void
): { fieldLabel: string; value: string; parameterName: string }[] {
    const successfulUpdates: { fieldLabel: string; value: string; parameterName: string }[] = [];

    for (const match of matches) {
        const bestFieldMatch = findBestFieldMatch(templateFields, match.matchedFieldLabels);
        
        if (bestFieldMatch) {
            // Check if the field is empty or if we should overwrite
            const currentField = templateFields.find(field => field.label === bestFieldMatch);
            if (currentField && (!currentField.value || currentField.value.trim() === '')) {
                updateFieldCallback(bestFieldMatch, match.value);
                successfulUpdates.push({
                    fieldLabel: bestFieldMatch,
                    value: match.value,
                    parameterName: match.parameterName
                });
            }
        }
    }

    return successfulUpdates;
}

/**
 * Main function to handle pasted content from MiscContactField
 * Processes content, finds matches, and populates corresponding template fields
 * @param pastedContent - The content that was pasted
 * @param templateFields - Available template fields
 * @param updateFieldCallback - Callback to update field values
 * @returns Promise resolving to successful updates
 */
export async function handleMiscContentPaste(
    pastedContent: string,
    templateFields: TemplateField[],
    updateFieldCallback: (label: string, value: string) => void
): Promise<{ fieldLabel: string; value: string; parameterName: string }[]> {
    try {
        // Process the pasted content against RainMeter patterns
        const matches = await processRainMeterContent(pastedContent);
        
        if (matches.length === 0) {
            console.log('No RainMeter patterns matched in pasted content');
            return [];
        }

        // Populate template fields based on matches
        const updates = populateTemplateFields(matches, templateFields, updateFieldCallback);
        
        console.log(`Successfully populated ${updates.length} fields from ${matches.length} matches`);
        return updates;
    } catch (error) {
        console.error('Failed to handle misc content paste:', error);
        return [];
    }
}
