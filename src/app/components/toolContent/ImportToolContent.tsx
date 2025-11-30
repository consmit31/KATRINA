import React, { useState } from 'react';
import { parseInput, parseCombinedImport } from '@utils/parseInput';
import { addIssue } from '@utils/indexedDB/IssueStorage';
import { addTemplate } from '@utils/indexedDB/TemplateStorage';
import Issue from '@dataTypes/Issue';
import Template from '@dataTypes/Template';

type ImportMode = 'separate' | 'combined';

function ImportToolContent() {
  const [importMode, setImportMode] = useState<ImportMode>('separate');
  const [issueFile, setIssueFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [combinedFile, setCombinedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [showInstructions, setShowInstructions] = useState(false);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const validateFileType = (file: File): boolean => {
    const validExtensions = ['.txt', '.json'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    fileType: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateFileType(file)) {
        setMessage(`Invalid file type for ${fileType}. Please select a .txt or .json file.`);
        setMessageType('error');
        return;
      }
      setFile(file);
      // Clear any existing error message when a valid file is selected
      if (messageType === 'error' && message.includes('file type')) {
        setMessage('');
        setMessageType('');
      }
    }
  };

  const handleImport = async () => {
    if (importMode === 'separate') {
      if (!issueFile || !templateFile) {
        setMessage('Please select both issue and template files.');
        setMessageType('error');
        return;
      }
    } else {
      if (!combinedFile) {
        setMessage('Please select a combined export file.');
        setMessageType('error');
        return;
      }
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      let issues: Issue[], templates: Template[];

      if (importMode === 'combined') {
        // Handle combined import
        const combinedText = await readFileAsText(combinedFile!);
        const result = parseCombinedImport(combinedText);
        issues = result.issues;
        templates = result.templates;
      } else {
        // Handle separate imports
        const issueText = await readFileAsText(issueFile!);
        const templateText = await readFileAsText(templateFile!);
        const result = parseInput(issueText, templateText);
        issues = result.issues;
        templates = result.templates;
      }

      // Import templates first (issues reference templates)
      let templateCount = 0;
      for (const template of templates) {
        try {
          await addTemplate(template);
          templateCount++;
        } catch (error) {
          // Template might already exist, log but continue
          console.warn(`Template "${template.name}" might already exist:`, error);
        }
      }

      // Import issues
      let issueCount = 0;
      for (const issue of issues) {
        try {
          await addIssue(issue.name, issue.templateNames);
          issueCount++;
        } catch (error) {
          // Issue might already exist, log but continue
          console.warn(`Issue "${issue.name}" might already exist:`, error);
        }
      }

      setMessage(
        `Import completed! Added ${templateCount} templates and ${issueCount} issues to the database.`
      );
      setMessageType('success');
      
      // Clear the form on successful import
      handleClear();
    } catch (error) {
      setMessage(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setIssueFile(null);
    setTemplateFile(null);
    setCombinedFile(null);
    setMessage('');
    setMessageType('');
    
    // Reset file inputs
    const issueInput = document.getElementById('issueFileInput') as HTMLInputElement;
    const templateInput = document.getElementById('templateFileInput') as HTMLInputElement;
    const combinedInput = document.getElementById('combinedFileInput') as HTMLInputElement;
    if (issueInput) issueInput.value = '';
    if (templateInput) templateInput.value = '';
    if (combinedInput) combinedInput.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Import Data</h3>
        <p className="text-sm text-accent-foreground mt-1">
          Import issues and templates from files
        </p>
      </div>

      {/* Import Mode Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-accent-foreground">Import Mode:</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="importMode"
              value="separate"
              checked={importMode === 'separate'}
              onChange={(e) => {
                setImportMode(e.target.value as ImportMode);
                handleClear();
              }}
              className="mr-2"
              disabled={isLoading}
            />
            <span className="text-sm text-accent-foreground">Separate Files (Issues + Templates)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="importMode"
              value="combined"
              checked={importMode === 'combined'}
              onChange={(e) => {
                setImportMode(e.target.value as ImportMode);
                handleClear();
              }}
              className="mr-2"
              disabled={isLoading}
            />
            <span className="text-sm text-accent-foreground">Combined File (Complete Export)</span>
          </label>
        </div>
      </div>

      {/* File Upload Section */}
      {importMode === 'separate' ? (
        <div className="space-y-4">
          {/* Issues File Upload */}
          <div>
            <label htmlFor="issueFileInput" className="block text-sm font-medium text-accent-foreground mb-2">
              Issues File (.txt or .json)
            </label>
            <input
              id="issueFileInput"
              type="file"
              accept=".txt,.json"
              onChange={(e) => handleFileChange(e, setIssueFile, 'issues')}
              className="w-full p-3 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading}
            />
            {issueFile && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Selected: {issueFile.name}
              </p>
            )}
          </div>

          {/* Templates File Upload */}
          <div>
            <label htmlFor="templateFileInput" className="block text-sm font-medium text-accent-foreground mb-2">
              Templates File (.txt or .json)
            </label>
            <input
              id="templateFileInput"
              type="file"
              accept=".txt,.json"
              onChange={(e) => handleFileChange(e, setTemplateFile, 'templates')}
              className="w-full p-3 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading}
            />
            {templateFile && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Selected: {templateFile.name}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Combined File Upload */}
          <div>
            <label htmlFor="combinedFileInput" className="block text-sm font-medium text-gray-700 mb-2">
              Combined Export File (.json)
            </label>
            <input
              id="combinedFileInput"
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange(e, setCombinedFile, 'combined export')}
              className="w-full p-3 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              disabled={isLoading}
            />
            {combinedFile && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Selected: {combinedFile.name}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Import from a complete export file that contains both issues and templates with metadata.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleImport}
          disabled={isLoading || 
            (importMode === 'separate' && (!issueFile || !templateFile)) ||
            (importMode === 'combined' && !combinedFile)
          }
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoading ? 'Importing...' : 'Import Data'}
        </button>

        <button
          onClick={handleClear}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="px-6 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-400 border-4 border-blue-500"
        >
          ?
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            messageType === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Instructions */}
      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-medium text-blue-900 mb-2">Import Instructions:</h3>
          
          {importMode === 'separate' ? (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Separate Files Mode:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload separate issues and templates files</li>
                <li>• Supports both legacy format (direct arrays) and new export format (with metadata)</li>
                <li>• Legacy format: Direct JSON arrays of issues/templates</li>
                <li>• New format: Objects with exportDate, totalItems, and data arrays</li>
                <li>• Files can be .txt or .json format</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Combined File Mode:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload a single combined export file</li>
                <li>• Must be in the new export format with metadata</li>
                <li>• Contains both issues and templates in one file</li>
                <li>• Generated by the &quot;Download All&quot; export option</li>
              </ul>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-blue-300">
            <h4 className="font-medium text-blue-900 mb-1">General:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Template names in issues must match template names exactly</li>
              <li>• Data is validated before importing</li>
              <li>• Existing items with same names are skipped to avoid duplicates</li>
              <li>• Import process shows progress and results</li>
            </ul>
          </div>
        </div>
      )}
      </div>
  );
}

export default ImportToolContent
