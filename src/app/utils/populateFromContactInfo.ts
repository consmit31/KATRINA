import TemplateField from "../dataTypes/TemplateField";

const fieldToPopulate = (fields: TemplateField[], labels: string[]): string | null => {
    for (const field of fields) {
        if (labels.includes(field.label)) {
            return field.label;
        }
    }

    return null;
};

const userIdFieldLabels = [
    "User ID",
    "User Name",
    "Username",
    "UserID",
    "User_Id",
    "User-Id",
];

export const userIdFieldToPopulate = (fields: TemplateField[]): string | null => {
    return fieldToPopulate(fields, userIdFieldLabels);
};

const nameFieldLabels = [
    "Name",
    "Full Name",
    "Contact Name",
    "Client Name"
];

export const nameFieldToPopulate = (fields: TemplateField[]): string | null => {
    return fieldToPopulate(fields, nameFieldLabels);
};

const emailFieldLabels = [
    "Email",
    "Email Address",
    "Contact Email",
    "Client Email"
];

export const emailFieldToPopulate = (fields: TemplateField[]): string | null => {
    return fieldToPopulate(fields, emailFieldLabels);
};

const phoneFieldLabels = [
    "Phone",
    "Phone Number",
    "Contact Phone",
    "Client Phone",
    "Client's contact information"
];

export const phoneFieldToPopulate = (fields: TemplateField[]): string | null => {
    return fieldToPopulate(fields, phoneFieldLabels);
};