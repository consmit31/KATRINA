import React, { useState, useEffect, useCallback } from 'react'
import parseTemplate from '@utils/parseTemplate'
import Template from '@dataTypes/Template'
import TemplateField from '@dataTypes/TemplateField'
import EditableField from './EditableField'
import useTemplateStorage from '@hooks/useTemplateStorage'
import useIssueStorage from '@hooks/useIssueStorage'
import { useAppDispatch } from '@redux/hooks'
import { triggerAllRefresh } from '@redux/dataRefreshSlice'

interface NewTemplateModalProps {
  onClose?: () => void;
  onTemplateCreated?: (template: Template) => void;
  copyFromTemplate?: Template;
}

const NewTemplateModal = ({ onClose, onTemplateCreated, copyFromTemplate }: NewTemplateModalProps) => {
  const [inputText, setInputText] = useState('')
  const [parsedTemplate, setParsedTemplate] = useState<Template>({
    issue: '',
    name: '',
    kba: '',
    fields: [],
    metrics: { usageCount: 0, usagePerDay: 0, commonWorkLog: []}
  })
  const [validTemplate, setValidTemplate] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(false);
  const [existingIssueNames, setExistingIssueNames] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);

  const { addNewTemplate, error, clearError, templates } = useTemplateStorage();
  const { addNewIssue, getIssueByName, addTemplateToExistingIssue, getAllIssueNames } = useIssueStorage();
  const dispatch = useAppDispatch();

  // Load existing issue names on component mount
  useEffect(() => {
    const loadIssueNames = async () => {
      try {
        const names = await getAllIssueNames();
        setExistingIssueNames(names);
      } catch (error) {
        console.error('Failed to load issue names:', error);
      }
    };
    loadIssueNames();
  }, [getAllIssueNames]);

  // Initialize with copied template if provided
  useEffect(() => {
    if (copyFromTemplate) {
      setParsedTemplate({
        issue: copyFromTemplate.issue,
        name: `${copyFromTemplate.name} (Copy)`,
        kba: copyFromTemplate.kba,
        fields: [...copyFromTemplate.fields], 
        metrics: { ...copyFromTemplate.metrics } 
      });
    }
  }, [copyFromTemplate]);

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

  const isValidIssue = useCallback(() => {
    return parsedTemplate.issue.trim().length > 0;
  }, [parsedTemplate.issue]);

  const isValidKba = useCallback(() => {
    const kbaPattern = /^KBA\d{8}$/;
    return kbaPattern.test(parsedTemplate.kba);
  }, [parsedTemplate.kba]);

  const isValidName = useCallback(() => {
    return parsedTemplate.name.trim().length > 0;
  }, [parsedTemplate.name]);

  const isValidFields = useCallback(() => {
    return parsedTemplate.fields.length > 0;
  }, [parsedTemplate.fields]);

  // Check for template validity whenever parsedTemplate changes
  useEffect(() => {
    const isValidTemplate = () => {
      if (!isValidIssue()) return false;

      if (!isValidKba()) return false;

      if (!isValidName()) return false;

      if (!isValidFields()) return false;

      return true;
    }

    const isValid = isValidTemplate();
    setValidTemplate(isValid);
  }, [parsedTemplate, isValidIssue, isValidKba, isValidName, isValidFields]);

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
    }));
  }

  // Handle issue input change with suggestions
  const handleIssueChange = (value: string) => {
    setParsedTemplate(prev => ({ ...prev, issue: value }));

    if (value.trim().length > 0) {
      const filtered = existingIssueNames.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && value.trim() !== '');
      setSelectedSuggestionIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setParsedTemplate(prev => ({ ...prev, issue: suggestion }));
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation for suggestions
  const handleIssueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleCopyFromTemplate = (templateToCopy: Template) => {
    setParsedTemplate({
      issue: templateToCopy.issue,
      name: `${templateToCopy.name} (Copy)`,
      kba: templateToCopy.kba,
      fields: [...templateToCopy.fields], // Deep copy the fields array
      metrics: { ...templateToCopy.metrics } // Deep copy the metrics object
    });
    setInputText(''); // Clear input text when copying
    setShowTemplateSelector(false);
  }

  const handleCreateTemplate = async () => {
    if (!validTemplate) return;

    setSaving(true);
    clearError();

    try {
      // Add new template to storage
      await addNewTemplate(parsedTemplate);

      // Check if issue exists and create or update accordingly
      const existingIssue = await getIssueByName(parsedTemplate.issue);
      if (!existingIssue) {
        // Issue doesn't exist, create it with the new template
        await addNewIssue(parsedTemplate.issue, [parsedTemplate.name]);
      } else {
        // Issue exists, add template to existing issue
        await addTemplateToExistingIssue(parsedTemplate.issue, parsedTemplate.name);
      }

      // Trigger refresh for components watching for data changes
      dispatch(triggerAllRefresh());

      // Call callbacks if provided
      onTemplateCreated?.(parsedTemplate);
      onClose?.();

      // Reset form
      setInputText('');
      setParsedTemplate({
        issue: '',
        name: '', 
        kba: '', 
        fields: [],
        metrics: { usageCount: 0, usagePerDay: 0, commonWorkLog: []}
      });
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create template:', err);
    } finally {
      setSaving(false);
    }
  }

  // Validation indicator component
  const ValidationIndicator = ({ isValid }: { isValid: boolean }) => (
    <span className={`ml-2 w-2 h-2 rounded-full inline-block ${isValid ? 'bg-green-500' : 'bg-red-500'
      }`} title={isValid ? 'Valid' : 'Invalid'} />
  )

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-card rounded-2xl shadow-2xl border w-full max-w-6xl max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-blue-600/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Create New Template</h2>
              <p className="text-sm text-muted-foreground">Build and configure your template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors focus-ring"
            disabled={saving}
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-120px)] overflow-hidden">
          {/* Input Section */}
          <div className="flex-1 p-6 border-r">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="template-input" className="text-sm font-medium text-card-foreground">
                  Template Text
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                    className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full cursor-pointer hover:bg-accent/80 transition-colors"
                    title="Copy from existing template"
                  >
                    Copy from Template
                  </button>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {inputText.length} characters
                  </div>
                </div>
              </div>

              {/* Template Selector */}
              {showTemplateSelector && (
                <div className="mb-4 p-3 bg-accent/20 border border-accent rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Select Template to Copy From:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {templates.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No templates available</p>
                    ) : (
                      templates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleCopyFromTemplate(template)}
                          className="w-full text-left p-2 text-xs bg-card hover:bg-accent rounded border transition-colors"
                        >
                          <div className="font-medium">{template.name}</div>
                          <div className="text-muted-foreground">{template.issue} • {template.fields.length} fields</div>
                        </button>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => setShowTemplateSelector(false)}
                    className="mt-2 text-xs text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <textarea
                id="template-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 p-4 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none font-mono text-sm"
                placeholder="Enter your template text here"
              />
            </div>
          </div>

          {/* Configuration Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between">
              <div>
                <h3 className="text-lg font-medium text-card-foreground mb-1">Template Configuration</h3>
                <p className="text-sm text-muted-foreground">Review and modify template details</p>
              </div>
              <div className='flex gap-2'>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded transition-colors ${validTemplate && !saving
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Issue */}
              <div className="space-y-2 relative">
                <label className="flex items-center text-sm font-medium text-card-foreground">
                  Issue Category
                  <ValidationIndicator isValid={isValidIssue()} />
                  {existingIssueNames.length > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {existingIssueNames.length} existing
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={parsedTemplate.issue}
                    onChange={(e) => handleIssueChange(e.target.value)}
                    onKeyDown={handleIssueKeyDown}
                    onFocus={() => {
                      if (parsedTemplate.issue.trim() && filteredSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding to allow for click on suggestion
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    placeholder="Enter issue category (type to see suggestions)"
                    autoComplete="off"
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${index === selectedSuggestionIndex
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50 text-popover-foreground'
                            }`}
                          onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{suggestion}</span>
                            <span className="text-xs text-muted-foreground">existing</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Template Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-card-foreground">
                  Template Name
                  <ValidationIndicator isValid={isValidName()} />
                </label>
                <input
                  type="text"
                  value={parsedTemplate.name}
                  onChange={(e) => handleTemplateNameChange(e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
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
      </div>
    </div>
  )
}

export default NewTemplateModal