import Template from "../dataTypes/Template";

export default function parseTemplate(text: String): Template { 
    // Extract each line from the text, trimming whitespace and colons
    const lines = text.split('\n').map(line => line.trim().replace(/:$/, '')).filter(line => line.length > 0);
    
    // Parse each line into a field object
    const fields = lines.map(line => {
        let label = line;
        let value = undefined;
        
        // Check for predefined Selector values using criteria
        // - In parentheses separated by slashes or 'or' (If options are Yes or No, simplify to Y and N)
        // - Two words separated by 'or'
        // Do not include parentheses with sentences not separated by slashes or 'or'
        // Do not change the label regardless of default value presence
        
        // First check for parentheses with valid selector options
        const parenMatch = line.match(/\(([^)]+)\)/);
        if (parenMatch) {
            const optionsRaw = parenMatch[1];
            let options: string[] = [];
            
            // Check if options are separated by slashes
            if (optionsRaw.includes('/')) {
                options = optionsRaw.split('/').map(opt => opt.trim());
            } 
            // Check if options are separated by 'or' (case insensitive)
            else if (optionsRaw.toLowerCase().includes(' or ')) {
                options = optionsRaw.split(/ or /i).map(opt => opt.trim());
            }
            
            // Only create selector if we found valid options
            if (options.length > 0) {
                // Simplify Yes/No to Y/N
                if (options.length === 2 && options.includes('Yes') && options.includes('No')) {
                    options = ['Y', 'N'];
                }
                
                // Keep the original label (trailing colon already removed in line processing)
                label = line;
                return { label, type: 'selector' as const, options };
            }
        }

        // Check for exactly two words/phrases separated by 'or' (without parentheses)
        // Only match if the entire line consists of just these two options separated by 'or'
        const twoWordOrMatch = line.match(/^([A-Za-z-]+)\s+or\s+([A-Za-z-]+)$/i);
        if (twoWordOrMatch) {
            const options = [twoWordOrMatch[1], twoWordOrMatch[2]];
            label = twoWordOrMatch[0];
            return { label, type: 'selector' as const, options };
        }

        // Check for default values indicated by a semicolon
        const semicolonIndex = line.indexOf(';');
        if (semicolonIndex !== -1) {
            label = line.substring(0, semicolonIndex).trim();
            value = line.substring(semicolonIndex + 1).trim();
        }

        // Remove trailing colon from label
        label = label.replace(/:$/, '');
        
        return { label, type: 'text' as const, ...(value ? { value } : {}) };
    });

    return {
        name: '',
        kba: '',
        fields
    }
};
    