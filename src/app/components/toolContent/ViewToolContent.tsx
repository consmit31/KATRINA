import React, { useState } from 'react'
import { useIssueStorage } from '@/app/hooks/useIssueStorage'
import { useTemplateStorage } from '@/app/hooks/useTemplateStorage'
import Template from '@/app/dataTypes/Template'
import TemplateField from '@/app/dataTypes/TemplateField'
import { StoredIssue } from '@/app/utils/indexedDB/IssueStorage'
import { useAppDispatch } from '@/app/redux/hooks'
import { triggerIssueRefresh, triggerTemplateRefresh, triggerAllRefresh } from '@/app/redux/dataRefreshSlice'

interface EditingIssue {
    name: string
    templateNames: string[]
    originalName: string
}

interface EditingTemplate {
    issue: string
    name: string
    kba: string
    fields: TemplateField[]
    originalName: string
}

function ViewToolContent() {
    const dispatch = useAppDispatch()
    
    const {
        issues,
        loading: issuesLoading,
        error: issuesError,
        updateExistingIssue,
        updateExistingIssueByName,
        removeIssue,
        refreshIssues,
        clearError: clearIssuesError
    } = useIssueStorage()

    const {
        templates,
        loading: templatesLoading,
        error: templatesError,
        updateTemplateByOriginalName,
        removeTemplateByName,
        refreshTemplates,
        clearError: clearTemplatesError
    } = useTemplateStorage()

    const [activeTab, setActiveTab] = useState<'issues' | 'templates'>('issues')
    const [editingIssue, setEditingIssue] = useState<EditingIssue | null>(null)
    const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Filter data based on search term
    const filteredIssues = issues.filter(issue =>
        issue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.templateNames.some(template =>
            template.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.kba.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEditIssue = (issue: StoredIssue) => {
        setEditingIssue({
            name: issue.name,
            templateNames: [...issue.templateNames],
            originalName: issue.name
        })
    }

    const handleEditTemplate = (template: Template) => {
        setEditingTemplate({
            ...template,
            fields: [...template.fields],
            originalName: template.name
        })
    }

    const handleSaveIssue = async () => {
        if (!editingIssue) return

        try {
            await updateExistingIssueByName(editingIssue.originalName, editingIssue.name, editingIssue.templateNames)
            setEditingIssue(null)
            await refreshIssues()
            // Trigger global refresh to update other components
            dispatch(triggerIssueRefresh())
        } catch (error) {
            console.error('Failed to update issue:', error)
        }
    }

    const handleSaveTemplate = async () => {
        if (!editingTemplate) return

        try {
            await updateTemplateByOriginalName(editingTemplate.originalName, editingTemplate)
            setEditingTemplate(null)
            await refreshTemplates()
            // Trigger global refresh to update other components
            dispatch(triggerTemplateRefresh())
        } catch (error) {
            console.error('Failed to update template:', error)
        }
    }

    const handleDeleteIssue = async (issueName: string) => {
        if (window.confirm(`Are you sure you want to delete the issue "${issueName}"?`)) {
            try {
                await removeIssue(issueName)
                await refreshIssues()
                // Trigger global refresh to update other components
                dispatch(triggerIssueRefresh())
            } catch (error) {
                console.error('Failed to delete issue:', error)
            }
        }
    }

    const handleDeleteTemplate = async (templateName: string) => {
        if (window.confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
            try {
                await removeTemplateByName(templateName)
                await refreshTemplates()
                // Trigger global refresh to update other components
                dispatch(triggerTemplateRefresh())
            } catch (error) {
                console.error('Failed to delete template:', error)
            }
        }
    }

    const handleClearAllData = async () => {
        if (window.confirm('Are you sure you want to delete ALL issues and templates? This action cannot be undone.')) {
            try {
                // Delete all issues
                const deleteIssuePromises = issues.map(issue => removeIssue(issue.name))
                await Promise.all(deleteIssuePromises)
                
                // Delete all templates
                const deleteTemplatePromises = templates.map(template => removeTemplateByName(template.name))
                await Promise.all(deleteTemplatePromises)
                
                // Refresh both data sets
                await Promise.all([refreshIssues(), refreshTemplates()])
                
                // Trigger global refresh to update other components
                dispatch(triggerAllRefresh())
                
                console.log('All data cleared successfully')
            } catch (error) {
                console.error('Failed to clear all data:', error)
                alert('An error occurred while clearing data. Please try again.')
            }
        }
    }

    const addTemplateNameToIssue = () => {
        if (editingIssue) {
            setEditingIssue({
                ...editingIssue,
                templateNames: [...editingIssue.templateNames, '']
            })
        }
    }

    const removeTemplateNameFromIssue = (index: number) => {
        if (editingIssue) {
            const newTemplateNames = editingIssue.templateNames.filter((_, i) => i !== index)
            setEditingIssue({
                ...editingIssue,
                templateNames: newTemplateNames
            })
        }
    }

    const updateTemplateNameInIssue = (index: number, value: string) => {
        if (editingIssue) {
            const newTemplateNames = [...editingIssue.templateNames]
            newTemplateNames[index] = value
            setEditingIssue({
                ...editingIssue,
                templateNames: newTemplateNames
            })
        }
    }

    const addFieldToTemplate = () => {
        if (editingTemplate) {
            const newField: TemplateField = {
                type: 'text',
                label: 'New Field',
                value: ''
            }
            setEditingTemplate({
                ...editingTemplate,
                fields: [...editingTemplate.fields, newField]
            })
        }
    }

    const updateFieldInTemplate = (index: number, field: TemplateField) => {
        if (editingTemplate) {
            const newFields = [...editingTemplate.fields]
            newFields[index] = field
            setEditingTemplate({
                ...editingTemplate,
                fields: newFields
            })
        }
    }

    const removeFieldFromTemplate = (index: number) => {
        if (editingTemplate) {
            const newFields = editingTemplate.fields.filter((_, i) => i !== index)
            setEditingTemplate({
                ...editingTemplate,
                fields: newFields
            })
        }
    }

    if (issuesLoading || templatesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading data...</div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col text-gray-600">
            <div className="flex-shrink-0 mb-6">
                <h1 className="text-2xl font-bold mb-4">View & Manage Data</h1>

                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setActiveTab('issues')}
                        className={`px-4 py-2 rounded ${activeTab === 'issues'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Issues ({issues.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 rounded ${activeTab === 'templates'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Templates ({templates.length})
                    </button>
                    <button
                        onClick={handleClearAllData}
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        Clear All Data
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Error Display */}
                {issuesError && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p>Issues Error: {issuesError}</p>
                        <button
                            onClick={clearIssuesError}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {templatesError && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p>Templates Error: {templatesError}</p>
                        <button
                            onClick={clearTemplatesError}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
                {/* Issues Tab */}
                {activeTab === 'issues' && (
                    <div>
                        {editingIssue && (
                            <div className="mb-6 p-4 border-3 border-card rounded-lg bg-card">
                                <span className='flex'>
                                    <h3 className="text-lg font-medium mb-3">Editing Issue: &nbsp;</h3>
                                    <h3 className="text-lg text-accent-foreground font-medium mb-3">{editingIssue.originalName}</h3>
                                </span>
                                

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Issue Name:</label>
                                    <input
                                        type="text"
                                        value={editingIssue.name}
                                        onChange={(e) => setEditingIssue({ ...editingIssue, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 text-accent-foreground rounded"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Template Names:</label>
                                    {editingIssue.templateNames.map((templateName, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                value={templateName}
                                                onChange={(e) => updateTemplateNameInIssue(index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-accent-foreground mr-2"
                                                placeholder="Template name"
                                            />
                                            <button
                                                onClick={() => removeTemplateNameFromIssue(index)}
                                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addTemplateNameToIssue}
                                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                                    >
                                        Add Template Name
                                    </button>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSaveIssue}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingIssue(null)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredIssues.map((issue) => (
                                <div key={issue.name} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg text-accent-foreground font-medium mb-2">{issue.name}</h3>
                                            <div className="mb-2">
                                                <span className="text-sm font-medium text-gray-600">Templates: </span>
                                                {issue.templateNames.length > 0 ? (
                                                    <span className="text-sm text-accent-foreground">
                                                        {issue.templateNames.join(', ')}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500 italic">No templates assigned</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEditIssue(issue)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteIssue(issue.name)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredIssues.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No issues found matching your search.' : 'No issues available.'}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Templates Tab */}
                {activeTab === 'templates' && (
                    <div>
                        {editingTemplate && (
                            <div className="mb-6 p-4 border-2 border-green-300 rounded-lg bg-green-50">
                                <h3 className="text-lg font-medium mb-3">Editing Template: {editingTemplate.originalName}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Template Name:</label>
                                        <input
                                            type="text"
                                            value={editingTemplate.name}
                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Issue:</label>
                                        <input
                                            type="text"
                                            value={editingTemplate.issue}
                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, issue: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">KBA:</label>
                                        <input
                                            type="text"
                                            value={editingTemplate.kba}
                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, kba: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Fields:</label>
                                    {editingTemplate.fields.map((field, index) => (
                                        <div key={index} className="mb-4 p-3 border border-gray-200 rounded bg-white">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => updateFieldInTemplate(index, { ...field, label: e.target.value })}
                                                    placeholder="Field label"
                                                    className="px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => updateFieldInTemplate(index, {
                                                        ...field,
                                                        type: e.target.value as 'text' | 'selector',
                                                        // Reset type-specific properties
                                                        ...(e.target.value === 'text' ?
                                                            { options: undefined, allowCustom: undefined } :
                                                            { options: field.options || ['Option 1', 'Option 2'] }
                                                        )
                                                    })}
                                                    className="px-3 py-2 border border-gray-300 rounded"
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="selector">Selector</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={field.value || ''}
                                                    onChange={(e) => updateFieldInTemplate(index, { ...field, value: e.target.value })}
                                                    placeholder="Default value"
                                                    className="px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <button
                                                    onClick={() => removeFieldFromTemplate(index)}
                                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {field.type === 'selector' && (
                                                <div className="mt-2">
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`allowCustom-${index}`}
                                                            checked={field.allowCustom || false}
                                                            onChange={(e) => updateFieldInTemplate(index, { ...field, allowCustom: e.target.checked })}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`allowCustom-${index}`} className="text-sm">Allow custom values</label>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Options (one per line):</label>
                                                        <textarea
                                                            value={(field.options || []).join('\n')}
                                                            onChange={(e) => updateFieldInTemplate(index, {
                                                                ...field,
                                                                options: e.target.value.split('\n').filter(opt => opt.trim())
                                                            })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                            rows={3}
                                                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addFieldToTemplate}
                                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Add Field
                                    </button>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSaveTemplate}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingTemplate(null)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredTemplates.map((template) => (
                                <div key={template.name} className="p-4 border border-gray-300 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium mb-2">{template.name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Issue: </span>
                                                    <span className="text-accent-foreground">{template.issue}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">KBA: </span>
                                                    <span className="text-accent-foreground">{template.kba}</span>
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-sm font-medium text-gray-600">Fields ({template.fields.length}): </span>
                                                {template.fields.length > 0 ? (
                                                    <span className="text-sm text-accent-foreground">
                                                        {template.fields.map(f => f.label).join(', ')}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500 italic">No fields defined</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEditTemplate(template)}
                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTemplate(template.name)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredTemplates.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No templates found matching your search.' : 'No templates available.'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewToolContent