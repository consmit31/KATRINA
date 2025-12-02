import React, { useState } from 'react';
import { useIssueStorage } from '@hooks/useIssueStorage';
import { useTemplateStorage } from '@hooks/useTemplateStorage';

function ExportToolContent() {
  const { issues, loading: issuesLoading } = useIssueStorage();
  const { templates, loading: templatesLoading } = useTemplateStorage();
  const [exportStatus, setExportStatus] = useState<string>('');

  const downloadJSON = (data: object, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportIssues = () => {
    if (issues.length === 0) {
      setExportStatus('No issues to export');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalIssues: issues.length,
      issues: issues
    };

    downloadJSON(exportData, `issues-export-${new Date().toISOString().split('T')[0]}.json`);
    setExportStatus(`Successfully exported ${issues.length} issues`);
    setTimeout(() => setExportStatus(''), 3000);
  };

  const exportTemplates = () => {
    if (templates.length === 0) {
      setExportStatus('No templates to export');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalTemplates: templates.length,
      templates: templates
    };

    downloadJSON(exportData, `templates-export-${new Date().toISOString().split('T')[0]}.json`);
    setExportStatus(`Successfully exported ${templates.length} templates`);
    setTimeout(() => setExportStatus(''), 3000);
  };

  const exportAll = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalIssues: issues.length,
      totalTemplates: templates.length,
      issues: issues,
      templates: templates
    };

    downloadJSON(exportData, `complete-export-${new Date().toISOString().split('T')[0]}.json`);
    setExportStatus(`Successfully exported ${issues.length} issues and ${templates.length} templates`);
    setTimeout(() => setExportStatus(''), 3000);
  };

  const isLoading = issuesLoading || templatesLoading;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
        <p className="text-sm text-gray-600 mt-1">
          Export your issues and templates as JSON files for backup or sharing.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading data...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Data Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Data Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Issues:</span>
                <span className="font-medium">{issues.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Templates:</span>
                <span className="font-medium">{templates.length}</span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Export Issues</h4>
                <p className="text-sm text-gray-600">Download all issues as JSON</p>
              </div>
              <button
                onClick={exportIssues}
                disabled={issues.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Download Issues
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Export Templates</h4>
                <p className="text-sm text-gray-600">Download all templates as JSON</p>
              </div>
              <button
                onClick={exportTemplates}
                disabled={templates.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Download Templates
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Export All Data</h4>
                <p className="text-sm text-gray-600">Download both issues and templates in one file</p>
              </div>
              <button
                onClick={exportAll}
                disabled={issues.length === 0 && templates.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Download All
              </button>
            </div>
          </div>

          {/* Export Status */}
          {exportStatus && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{exportStatus}</p>
            </div>
          )}

          {/* File Format Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Export Format</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Files are exported in JSON format</li>
              <li>• Each export includes metadata (export date, counts)</li>
              <li>• Files are named with the current date for easy identification</li>
              <li>• Individual exports contain only the specific data type</li>
              <li>• Complete export includes both issues and templates</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportToolContent;
