import React, { useState } from 'react';
import { parseInput } from '@utils/parseInput';
import { addIssue } from '@utils/indexedDB/IssueStorage';
import { addTemplate } from '@utils/indexedDB/TemplateStorage';
import Issue from '@dataTypes/Issue';
import Template from '@dataTypes/Template';

function ImportToolContent() {
  const [issueFile, setIssueFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
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
    if (!issueFile || !templateFile) {
      setMessage('Please select both issue and template files.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Read file contents
      const issueText = await readFileAsText(issueFile);
      const templateText = await readFileAsText(templateFile);

      // Parse and validate the input
      const { issues, templates } = parseInput(issueText, templateText);

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
      setIssueFile(null);
      setTemplateFile(null);
      // Reset file inputs
      const issueInput = document.getElementById('issueFileInput') as HTMLInputElement;
      const templateInput = document.getElementById('templateFileInput') as HTMLInputElement;
      if (issueInput) issueInput.value = '';
      if (templateInput) templateInput.value = '';
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
    setMessage('');
    setMessageType('');
    
    // Reset file inputs
    const issueInput = document.getElementById('issueFileInput') as HTMLInputElement;
    const templateInput = document.getElementById('templateFileInput') as HTMLInputElement;
    if (issueInput) issueInput.value = '';
    if (templateInput) templateInput.value = '';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl text-gray-600 font-bold mb-6">Import Issues and Templates</h2>
      
      <div className="space-y-6">
        {/* Issues File Upload */}
        <div>
          <label htmlFor="issueFileInput" className="block text-sm font-medium text-gray-700 mb-2">
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
          <p className="text-sm text-gray-500 mt-1">
            Upload your issues JSON file. Each issue should have a name and templateNames array.
          </p>
        </div>

        {/* Templates File Upload */}
        <div>
          <label htmlFor="templateFileInput" className="block text-sm font-medium text-gray-700 mb-2">
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
          <p className="text-sm text-gray-500 mt-1">
            Upload your templates JSON file. Each template should have issue, name, kba, and fields properties.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleImport}
            disabled={isLoading || !issueFile || !templateFile}
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
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Upload your issues file (.txt or .json format)</li>
              <li>2. Upload your templates file (.txt or .json format)</li>
            <li>3. Ensure each issue's templateNames match the template names exactly</li>
            <li>4. The tool will validate the data before importing to IndexedDB</li>
            <li>5. Existing items with the same names will be skipped to avoid duplicates</li>
            <li>6. Both files must contain valid JSON arrays with the correct structure</li>
          </ul>
        </div>
        )}
      </div>
    </div>
  );
}

export default ImportToolContent
