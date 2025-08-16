import TemplateField from "./TemplateField";

export default interface Template {
    name: string;
    kba: string;
    fields: TemplateField[];
}