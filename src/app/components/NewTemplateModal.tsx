import React, { useState, useEffect } from 'react'
import parseTemplate from '@utils/parseTemplate'
import Template from '@dataTypes/Template'
import TemplateField from '@dataTypes/TemplateField'
import EditableField from './EditableField'
import useTemplateStorage from '@hooks/useTemplateStorage'
import { useIssueStorage } from '@hooks/useIssueStorage'
import { useAppDispatch } from '@redux/hooks'
import { triggerAllRefresh } from '@redux/dataRefreshSlice'

interface NewTemplateModalProps {
  onClose?: () => void;
  onTemplateCreated?: (template: Template) => void;
}

const NewTemplateModal = ({ onClose, onTemplateCreated }: NewTemplateModalProps) => {
  const [inputText, setInputText] = useState('')
  const [parsedTemplate, setParsedTemplate] = useState<Template>({
    issue: '',
    name: '',
    kba: '',
    fields: []
  })
  const [validTemplate, setValidTemplate] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  
  const { addNewTemplate, error, clearError } = useTemplateStorage();
  const { addNewIssue, getIssue, addTemplateToExistingIssue} = useIssueStorage();
  const dispatch = useAppDispatch();

  // Parse template whenever input text changes
  useEffect(() => {
    if (inputText.trim()) {
      const parsed = parseTemplate(inputText)
      // Preserve manually entered name and KBA, only update fields
      setParsedTemplate(prev => ({
        ...prev,
        fields: parsed.fields // Only update the fields from parsing
      }))
    } else {
      // When input is cleared, only clear the fields, preserve name and KBA
      setParsedTemplate(prev => ({
        ...prev,
        fields: []
      }))
    }
  }, [inputText])

  const isValidIssue = () => {
    return parsedTemplate.issue.trim().length > 0;
  }

  const isValidKba = () => {
    const kbaPattern = /^KBA\d{8}$/;
    return kbaPattern.test(parsedTemplate.kba); 
  }

  const isValidName = () => {
    return parsedTemplate.name.trim().length > 0;
  }

  const isValidFields = () => {
    return parsedTemplate.fields.length > 0;
  }

  const isValidTemplate = () => {
    if (!isValidKba()) return false;

    if (!isValidName()) return false;

    if (!isValidFields()) return false;
    return true;
  }

  // Check for template validity whenever parsedTemplate changes
  useEffect(() => {
    const isValid = isValidTemplate();
    setValidTemplate(isValid);
  }, [parsedTemplate])

  const handleTemplateNameChange = (newName: string) => {
    setParsedTemplate(prev => ({ ...prev, name: newName }))
  }

  const handleKbaChange = (newKba: string) => {
    setParsedTemplate(prev => ({ ...prev, kba: newKba }))
  }

  const handleFieldChange = (index: number, updatedField: TemplateField) => {
    setParsedTemplate(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => i === index ? updatedField : field)
    }))
  }

  const handleDeleteField = (index: number) => {
    setParsedTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const handleAddField = () => {
    const newField: TemplateField = {
      type: 'text',
      label: 'New Field'
    }
    setParsedTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const handleCreateTemplate = async () => {
    if (!validTemplate) return;
    
    setSaving(true);
    clearError();
    
    try {
      // Add new template to storage
      const templateId = await addNewTemplate(parsedTemplate);
      
      // Add issue to storage or link template to issue if needed
      if (getIssue(parsedTemplate.issue) === null) {
        await addNewIssue(parsedTemplate.issue, [parsedTemplate.name]);
      } else {
        await addTemplateToExistingIssue(parsedTemplate.issue, parsedTemplate.name);
      }
      
      // Trigger refresh for components watching for data changes
      dispatch(triggerAllRefresh());
      
      // Call callbacks if provided
      onTemplateCreated?.(parsedTemplate);
      onClose?.();
      
      // Reset form
      setInputText('');
      setParsedTemplate({ issue: '', name: '', kba: '', fields: [] });
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create template:', err);
    } finally {
      setSaving(false);
    }
  }

  // Validation indicator component
  const ValidationIndicator = ({ isValid }: { isValid: boolean }) => (
    <span className={`ml-2 w-2 h-2 rounded-full inline-block ${
      isValid ? 'bg-green-500' : 'bg-red-500'
    }`} title={isValid ? 'Valid' : 'Invalid'} />
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-90vh overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">New Template</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <label htmlFor="template-input" className="block text-sm font-medium text-gray-700 mb-2">
              Template Text
            </label>
            <textarea
              id="template-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-80 p-3 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter template text here..."
            />
          </div>

          {/* Output Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parsed Template
            </label>
            <div className="h-80 p-3 border text-black border-gray-300 rounded-md bg-gray-50 overflow-y-auto">
              {/* Issue */}
              <div className="mb-3">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                  Issue
                  <ValidationIndicator isValid={isValidIssue()} />
                </label>
                <input
                  type="text"
                  value={parsedTemplate.issue}
                  onChange={(e) => setParsedTemplate(prev => ({ ...prev, issue: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter issue"
                />
              </div>
              
              {/* Template Name */} 
              <div className="mb-3">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                  Template Name
                  <ValidationIndicator isValid={isValidName()} />
                </label>
                <input
                  type="text"
                  value={parsedTemplate.name}
                  onChange={(e) => handleTemplateNameChange(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                />
              </div>

              {/* KBA */}
              <div className="mb-3">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                  KBA
                  <ValidationIndicator isValid={isValidKba()} />
                </label>
                <input
                  type="text"
                  value={parsedTemplate.kba}
                  onChange={(e) => handleKbaChange(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter KBA"
                />
              </div>

              {/* Fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-xs font-medium text-gray-600">
                    Fields ({parsedTemplate.fields.length})
                    <ValidationIndicator isValid={isValidFields()} />
                  </label>
                  <button
                    onClick={handleAddField}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Field
                  </button>
                </div>
                {parsedTemplate.fields.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No fields yet. Parse template text or add manually.</p>
                ) : (
                  <div className="space-y-2">
                    {parsedTemplate.fields.map((field, index) => (
                      <EditableField
                        key={index}
                        field={field}
                        index={index}
                        onFieldChange={handleFieldChange}
                        onDeleteField={handleDeleteField}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded transition-colors ${
              validTemplate && !saving
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!validTemplate || saving}
            onClick={handleCreateTemplate}
            title={!validTemplate ? 'Complete all required fields to create template' : 'Create template'}
          >
            {saving ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewTemplateModal