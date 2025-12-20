import TemplateField from "./TemplateField";
import TemplateMetric from "./TemplateMetric";

export default interface Template {
    issue: string;
    name: string;
    kba: string;
    fields: TemplateField[];
    metrics: TemplateMetric;
}