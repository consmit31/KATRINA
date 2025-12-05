// Example usage of the new IndexedDB-based custom field labels system

import { 
  getCustomFieldLabelsConfig, 
  updateFieldLabels, 
  addFieldLabel, 
  removeFieldLabel, 
  resetToDefaultConfig 
} from '../src/app/utils/indexedDB/CustomFieldLabelsStorage';

// Example: Getting current configuration
async function getCurrentConfig() {
  try {
    const config = await getCustomFieldLabelsConfig();
    console.log('Current configuration:', config);
    return config;
  } catch (error) {
    console.error('Failed to get configuration:', error);
  }
}

// Example: Adding a new label to user ID field
async function addUserIdLabel(newLabel: string) {
  try {
    await addFieldLabel('userIdLabels', newLabel);
    console.log(`Added "${newLabel}" to user ID labels`);
  } catch (error) {
    console.error('Failed to add label:', error);
  }
}

// Example: Removing a label from email field
async function removeEmailLabel(labelToRemove: string) {
  try {
    await removeFieldLabel('emailLabels', labelToRemove);
    console.log(`Removed "${labelToRemove}" from email labels`);
  } catch (error) {
    console.error('Failed to remove label:', error);
  }
}

// Example: Updating all phone labels at once
async function updatePhoneLabels(newLabels: string[]) {
  try {
    await updateFieldLabels('phoneLabels', newLabels);
    console.log('Updated phone labels:', newLabels);
  } catch (error) {
    console.error('Failed to update phone labels:', error);
  }
}

// Example: Reset to defaults
async function resetConfiguration() {
  try {
    await resetToDefaultConfig();
    console.log('Configuration reset to defaults');
  } catch (error) {
    console.error('Failed to reset configuration:', error);
  }
}

export {
  getCurrentConfig,
  addUserIdLabel,
  removeEmailLabel,
  updatePhoneLabels,
  resetConfiguration
};