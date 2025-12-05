import TemplateField from "../dataTypes/TemplateField";
import { getFieldLabels } from "./indexedDB/CustomFieldLabelsStorage";

const fieldToPopulate = (fields: TemplateField[], labels: string[]): string | null => {
    for (const field of fields) {
        if (labels.includes(field.label)) {
            return field.label;
        }
    }

    return null;
};

export const userIdFieldToPopulate = async (fields: TemplateField[]): Promise<string | null> => {
    try {
        const labels = await getFieldLabels('userIdLabels');
        return fieldToPopulate(fields, labels);
    } catch (error) {
        console.error('Failed to get user ID labels from IndexedDB:', error);
        // Fallback to default labels
        const fallbackLabels = ["User ID", "User Name", "Username", "UserID", "User_Id", "User-Id"];
        return fieldToPopulate(fields, fallbackLabels);
    }
};

export const nameFieldToPopulate = async (fields: TemplateField[]): Promise<string | null> => {
    try {
        const labels = await getFieldLabels('nameLabels');
        return fieldToPopulate(fields, labels);
    } catch (error) {
        console.error('Failed to get name labels from IndexedDB:', error);
        // Fallback to default labels
        const fallbackLabels = ["Name", "Full Name", "Contact Name", "Client Name"];
        return fieldToPopulate(fields, fallbackLabels);
    }
};

export const emailFieldToPopulate = async (fields: TemplateField[]): Promise<string | null> => {
    try {
        const labels = await getFieldLabels('emailLabels');
        return fieldToPopulate(fields, labels);
    } catch (error) {
        console.error('Failed to get email labels from IndexedDB:', error);
        // Fallback to default labels
        const fallbackLabels = ["Email", "Email Address", "Contact Email", "Client Email"];
        return fieldToPopulate(fields, fallbackLabels);
    }
};

export const phoneFieldToPopulate = async (fields: TemplateField[]): Promise<string | null> => {
    try {
        const labels = await getFieldLabels('phoneLabels');
        return fieldToPopulate(fields, labels);
    } catch (error) {
        console.error('Failed to get phone labels from IndexedDB:', error);
        // Fallback to default labels
        const fallbackLabels = ["Phone", "Phone Number", "Contact Phone", "Client Phone", "Client's contact information"];
        return fieldToPopulate(fields, fallbackLabels);
    }
};