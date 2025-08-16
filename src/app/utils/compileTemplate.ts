import Template from "../dataTypes/Template";

const compileTemplate = (
    template: Template,
    formValues: { [fieldLabel: string]: string }
): string => {
    let result = `${template.name}\n${template.kba}`;
    for (const key of Object.keys(formValues)) {
        result += `\n${key}: ${formValues[key]}`;
    }
    return result;
};

export default compileTemplate;