import TemplateField from "./TemplateField";

export default interface Template {
    issue: string;
    name: string;
    kba: string;
    fields: TemplateField[];
}