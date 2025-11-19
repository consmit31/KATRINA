interface TemplateField {
    type: "selector" | "text";
    label: string;
    value?: string; // Set as default if applicable

    // Only for type "selector"
    allowCustom?: boolean;
    options?: string[]; 
};

export default TemplateField;