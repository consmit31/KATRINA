import React from 'react'
import { TabConfig } from './AutomationModal'
import { addFieldLabel, removeFieldLabel, resetToDefaultConfig } from '@/app/utils/indexedDB/CustomFieldLabelsStorage';
import { FaRegTrashAlt } from 'react-icons/fa';

interface ContactFieldTabContentProps {
    tabConfig: TabConfig
    activeFieldConfig: string[];
    onConfigChange: () => void;
}

type FieldType = 'userIdLabels' | 'nameLabels' | 'emailLabels' | 'phoneLabels';


const ContactFieldTabContent = ({ tabConfig, activeFieldConfig, onConfigChange }: ContactFieldTabContentProps) => {
    const [newLabel, setNewLabel] = React.useState('');

    const handleAddLabel = async (fieldType: FieldType) => {
        const label = newLabel.trim();
        if (label && !activeFieldConfig.includes(label)) {
            try {
                await addFieldLabel(fieldType, label);
                setNewLabel('');
                onConfigChange(); // Refresh the parent component's state
            } catch (error) {
                console.error(`Failed to add ${fieldType} label:`, error);
            }
        }
    };

    const handleRemoveLabel = async (fieldType: FieldType, labelToRemove: string) => {
        try {
            await removeFieldLabel(fieldType, labelToRemove);
            onConfigChange(); // Refresh the parent component's state
        } catch (error) {
            console.error(`Failed to remove ${fieldType} label:`, error);
        }
    };

    const handleResetToDefaults = async (fieldType: FieldType) => {
        try {
            await resetToDefaultConfig(fieldType);
            onConfigChange(); // Refresh the parent component's state
        } catch (error) {
            console.error('Failed to reset to default configuration:', error);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 animate-fadein" key={tabConfig.type}>
                <p className="text-sm text-gray-600 mb-4">
                    Configure which template field labels should automatically populate with {tabConfig.title.toLowerCase()} information.
                    When a template field matches any of these labels, it will be auto-filled with the corresponding contact data.
                </p>
            </div>

            <div className="max-w-2xl animate-fadeIn" key={`${tabConfig.type}-content`}>
                <div className='flex justify-between items-center py-4'>
                    <h3 className="text-lg font-semibold mb-4 text-accent-foreground">{
                        tabConfig.title} Field Labels
                    </h3>
                    <button
                        className='px-4 py-2 bg-gray-500 hover:bg-gray-700 rounded-lg transition-all duration-200'
                        onClick={() => handleResetToDefaults(tabConfig.type as FieldType)}
                    >
                        Reset {tabConfig.title} to Defaults
                    </button>
                </div>
                

                <div className="mb-6">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder={`Add new ${tabConfig.title.toLowerCase()} label`}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => handleAddLabel(tabConfig.type as FieldType)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                        >
                            Add Label
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {activeFieldConfig.map((label, index) => (
                        <div 
                            key={index}
                            className='flex justify-between items-center bg-card border px-4 py-3 rounded-full animate-slideIn'
                        >
                            <span className="text-sm text-card-foreground font-medium">{label}</span>
                            <button 
                                onClick={() => handleRemoveLabel(tabConfig.type as FieldType, label)}
                                className="text-white bg-red-600 hover:bg-red-800 ml-2 px-3 py-1 rounded-full transition-all duration-200 hover:scale-105"
                            >
                                <FaRegTrashAlt />    
                            </button>
                        </div>
                    ))}

                    {activeFieldConfig.length === 0 && (
                        <div className="text-center py-8 animate-fadein">
                            <div className="text-gray-400 text-sm italic">
                                No {tabConfig.title.toLowerCase()} labels configured.
                            </div>
                            <div className='text-gray-500 text-xs mt-2'>
                                Add labels above to enable auto population for {tabConfig.title.toLowerCase()} fields
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default ContactFieldTabContent