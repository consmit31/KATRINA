import React, { useState } from 'react'
import TemplateField from '../dataTypes/TemplateField'

interface EditableFieldProps {
  field: TemplateField
  index: number
  onFieldChange: (index: number, updatedField: TemplateField) => void
  onDeleteField: (index: number) => void
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  field, 
  index, 
  onFieldChange, 
  onDeleteField 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localField, setLocalField] = useState<TemplateField>(field)

  // Update local state when field prop changes
  React.useEffect(() => {
    setLocalField(field)
  }, [field])

  const handleFieldUpdate = (updatedField: TemplateField) => {
    setLocalField(updatedField)
    onFieldChange(index, updatedField)
  }

  const handleLabelChange = (newLabel: string) => {
    handleFieldUpdate({ ...localField, label: newLabel })
  }

  const handleTypeChange = (newType: 'text' | 'selector') => {
    const updatedField: TemplateField = {
      ...localField,
      type: newType,
      // Reset type-specific properties when changing type
      ...(newType === 'text' ? 
        { options: undefined, allowCustom: undefined } : 
        { options: localField.options || ['Option 1', 'Option 2'] }
      )
    }
    handleFieldUpdate(updatedField)
  }

  const handleValueChange = (newValue: string) => {
    handleFieldUpdate({ 
      ...localField, 
      value: newValue || undefined 
    })
  }

  const handleOptionsChange = (newOptions: string[]) => {
    handleFieldUpdate({ 
      ...localField, 
      options: newOptions.length > 0 ? newOptions : undefined 
    })
  }

  const handleAllowCustomChange = (allowCustom: boolean) => {
    handleFieldUpdate({ 
      ...localField, 
      allowCustom: allowCustom || undefined 
    })
  }

  const addOption = () => {
    const currentOptions = localField.options || []
    handleOptionsChange([...currentOptions, `Option ${currentOptions.length + 1}`])
  }

  const updateOption = (optionIndex: number, newValue: string) => {
    const currentOptions = localField.options || []
    const updatedOptions = currentOptions.map((opt, i) => 
      i === optionIndex ? newValue : opt
    )
    handleOptionsChange(updatedOptions)
  }

  const removeOption = (optionIndex: number) => {
    const currentOptions = localField.options || []
    const updatedOptions = currentOptions.filter((_, i) => i !== optionIndex)
    handleOptionsChange(updatedOptions)
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-card">
      {/* Collapsed Header */}
      <div 
        className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{localField.label || 'Untitled Field'}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              localField.type === 'selector' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {localField.type}
            </span>
          </div>
          {localField.type === 'selector' && localField.options && (
            <span className="text-xs text-gray-500">
              ({localField.options.length})
            </span>
          )}
          {localField.value && (
            <span className="text-xs text-gray-500">
              Default: {localField.value}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteField(index)
            }}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Delete field"
          >
            ×
          </button>
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Label
            </label>
            <input
              type="text"
              value={localField.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter field label"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              value={localField.type}
              onChange={(e) => handleTypeChange(e.target.value as 'text' | 'selector')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">Text Input</option>
              <option value="selector">Dropdown/Selector</option>
            </select>
          </div>

          {/* Default Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Value (Optional)
            </label>
            <input
              type="text"
              value={localField.value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter default value"
            />
          </div>

          {/* Selector-specific options */}
          {localField.type === 'selector' && (
            <>
              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dropdown Options
                  </label>
                  <button
                    onClick={addOption}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {(localField.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <button
                        onClick={() => removeOption(optionIndex)}
                        className="px-2 py-1 text-red-500 hover:text-red-700"
                        title="Remove option"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allow Custom Input */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localField.allowCustom || false}
                    onChange={(e) => handleAllowCustomChange(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Allow custom input (users can type their own value)
                  </span>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default EditableField