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
  const [activeTab, setActiveTab] = useState<FieldType>('userIdLabels')
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
      title: 'User ID',
      labels: config.userIdLabels
    },
    {
      type: 'nameLabels',
      title: 'Name',
      labels: config.nameLabels
    },
    {
      type: 'emailLabels',
      title: 'Email',
      labels: config.emailLabels
    },
    {
      type: 'phoneLabels',
      title: 'Phone',
      labels: config.phoneLabels
    }
  ];

  const activeFieldConfig = fieldConfigs.find(config => config.type === activeTab);

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
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-accent-foreground">Loading configuration...</div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="">
                <div className="flex">
                  {fieldConfigs.map((configItem) => (
                    <button
                      key={configItem.type}
                      onClick={() => setActiveTab(configItem.type)}
                      className={`px-6 py-2 text-sm bg-accent rounded-lg rounded-b-none border-accent-foreground font-medium transition-all duration-300 ease-in-out transform ${
                        activeTab === configItem.type
                          ? 'bg-blue-500 text-white shadow-md scale-105'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102'
                      }`}
                    >
                      {configItem.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6 animate-fadeIn" key={activeTab}>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure which template field labels should automatically populate with {activeFieldConfig?.title.toLowerCase()} information. 
                    When a template field matches any of these labels, it will be auto-filled with the corresponding contact data.
                  </p>
                  <button
                    onClick={handleResetToDefaults}
                    className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all duration-200 text-sm hover:scale-105"
                  >
                    Reset All to Defaults
                  </button>
                </div>

                {activeFieldConfig && (
                  <div className="max-w-2xl animate-fadeIn" key={`${activeTab}-content`}>
                    <h3 className="text-lg font-semibold mb-4 text-accent-foreground">
                      {activeFieldConfig.title} Field Labels
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLabels[activeTab]}
                          onChange={(e) => setNewLabels(prev => ({ ...prev, [activeTab]: e.target.value }))}
                          onKeyPress={(e) => handleKeyPress(e, activeTab)}
                          placeholder="Add new label..."
                          className="flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <button
                          onClick={() => handleAddLabel(activeTab)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 text-sm hover:scale-105"
                        >
                          Add Label
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {activeFieldConfig.labels.map((label, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center bg-card border px-4 py-3 rounded-full animate-slideIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="text-sm text-card-foreground font-medium">{label}</span>
                          <button
                            onClick={() => handleRemoveLabel(activeTab, label)}
                            className="text-white bg-red-600 hover:bg-red-800 text-sm font-bold ml-2 px-3 py-1 rounded-full transition-all duration-200 hover:scale-105"
                            title="Remove label"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {activeFieldConfig.labels.length === 0 && (
                        <div className="text-center py-8 animate-fadeIn">
                          <div className="text-gray-400 text-sm italic">
                            No {activeFieldConfig.title.toLowerCase()} labels configured
                          </div>
                          <div className="text-gray-500 text-xs mt-2">
                            Add labels above to enable auto-population for {activeFieldConfig.title.toLowerCase()} fields
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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