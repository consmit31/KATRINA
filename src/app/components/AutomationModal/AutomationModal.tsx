import React, { useState, useEffect } from 'react'
import { 
  getCustomFieldLabelsConfig, 
  addFieldLabel, 
  removeFieldLabel, 
  resetToDefaultConfig,
  CustomFieldLabelsConfig 
} from '@utils/indexedDB/CustomFieldLabelsStorage'

interface AutomationModalProps {
  onClose?: () => void;
}

type FieldType = 'userIdLabels' | 'nameLabels' | 'emailLabels' | 'phoneLabels';

interface FieldConfig {
  type: FieldType;
  title: string;
  labels: string[];
}

const AutomationModal = ({ onClose }: AutomationModalProps) => {
  const [config, setConfig] = useState<CustomFieldLabelsConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [newLabels, setNewLabels] = useState<Record<FieldType, string>>({
    userIdLabels: '',
    nameLabels: '',
    emailLabels: '',
    phoneLabels: ''
  });

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const loadedConfig = await getCustomFieldLabelsConfig()
      setConfig(loadedConfig)
    } catch (error) {
      console.error('Failed to load custom field labels config:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!config) {
    return null
  }

  const fieldConfigs: FieldConfig[] = [
    {
      type: 'userIdLabels',
      title: 'User ID Field Labels',
      labels: config.userIdLabels
    },
    {
      type: 'nameLabels',
      title: 'Name Field Labels',
      labels: config.nameLabels
    },
    {
      type: 'emailLabels',
      title: 'Email Field Labels',
      labels: config.emailLabels
    },
    {
      type: 'phoneLabels',
      title: 'Phone Field Labels',
      labels: config.phoneLabels
    }
  ];

  const handleAddLabel = async (fieldType: FieldType) => {
    const label = newLabels[fieldType].trim();
    if (label && !config[fieldType].includes(label)) {
      try {
        await addFieldLabel(fieldType, label)
        setConfig(prev => prev ? {
          ...prev,
          [fieldType]: [...prev[fieldType], label]
        } : null)
        setNewLabels(prev => ({ ...prev, [fieldType]: '' }));
      } catch (error) {
        console.error(`Failed to add ${fieldType} label:`, error)
      }
    }
  };

  const handleRemoveLabel = async (fieldType: FieldType, labelToRemove: string) => {
    try {
      await removeFieldLabel(fieldType, labelToRemove)
      setConfig(prev => prev ? {
        ...prev,
        [fieldType]: prev[fieldType].filter(label => label !== labelToRemove)
      } : null)
    } catch (error) {
      console.error(`Failed to remove ${fieldType} label:`, error)
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, fieldType: FieldType) => {
    if (e.key === 'Enter') {
      handleAddLabel(fieldType);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      await resetToDefaultConfig()
      await loadConfig()
    } catch (error) {
      console.error('Failed to reset to default configuration:', error)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-200">
          <span className="flex justify-between items-center">
            <h2 className="text-xl text-accent-foreground font-semibold">Contact Field Automation Settings</h2>
            <button 
              className="text-white bg-red-600 rounded px-3 py-1 hover:bg-red-700 transition-colors" 
              onClick={onClose}
            >
              ×
            </button>
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-accent-foreground">Loading configuration...</div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Configure which template field labels should automatically populate with contact information. 
                  When a template field matches any of these labels, it will be auto-filled with the corresponding contact data.
                </p>
                <button
                  onClick={handleResetToDefaults}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldConfigs.map((configItem) => (
                  <div key={configItem.type} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-accent-foreground">{configItem.title}</h3>
                    
                    <div className="mb-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLabels[configItem.type]}
                          onChange={(e) => setNewLabels(prev => ({ ...prev, [configItem.type]: e.target.value }))}
                          onKeyPress={(e) => handleKeyPress(e, configItem.type)}
                          placeholder="Add new label..."
                          className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddLabel(configItem.type)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {configItem.labels.map((label, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">{label}</span>
                          <button
                            onClick={() => handleRemoveLabel(configItem.type, label)}
                            className="text-red-600 hover:text-red-800 text-sm font-bold ml-2"
                            title="Remove label"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {configItem.labels.length === 0 && (
                        <div className="text-gray-400 text-sm italic py-2">
                          No labels configured
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutomationModal