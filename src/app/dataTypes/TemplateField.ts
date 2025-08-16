interface TemplateField {
    type: "selector" | "text";
    label: string;
    allowCustom: boolean;
    options?: string[];
    value?: string;
};

export default TemplateField;