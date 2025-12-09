import { RainMeterParameter } from '@/app/utils/indexedDB/RainMeterMatchStorage'
import React from 'react'
import { FaPen, FaRegSave, FaUndo, FaTimes, FaPlus } from 'react-icons/fa';

import {
    setRegexForParameter,
    setFieldsForParameter,
    resetParameterToDefault,
} from '@utils/indexedDB/RainMeterMatchStorage';
interface RainMeterSettingsProps {
    rainMeterParam: RainMeterParameter;
}

const RainMeterSettings = ({ rainMeterParam }: RainMeterSettingsProps) => {
    const [pattern, setPattern] = React.useState(rainMeterParam.pattern.source);
    const [originalPattern, setOriginalPattern] = React.useState(rainMeterParam.pattern.source);
    const [editingPattern, setEditingPattern] = React.useState(false);
    const [fields, setFields] = React.useState<string[]>(rainMeterParam.fields);
    const [addingField, setAddingField] = React.useState(false);
    const [newFieldInput, setNewFieldInput] = React.useState('');

    const handleEditPattern = () => {
        setOriginalPattern(pattern);
        setEditingPattern(true);
    };

    const handleSaveRegex = async () => {
        try {
            await setRegexForParameter(rainMeterParam.configKey, new RegExp(pattern));
            setEditingPattern(false);
            console.log(`Successfully updated pattern for ${rainMeterParam.name}`);
        } catch (error) {
            console.error(`Failed to update pattern for ${rainMeterParam.name}:`, error);
            // Optionally show user feedback here
        }
    };

    const handleDiscardChanges = () => {
        setPattern(originalPattern);
        setEditingPattern(false);
    };

    const handleResetPatternToDefault = async () => {
        try {
            await resetParameterToDefault(rainMeterParam.configKey);
            // Update local state to reflect the reset
            setPattern(rainMeterParam.pattern.source);
            setOriginalPattern(rainMeterParam.pattern.source);
            setFields(rainMeterParam.fields);
            setEditingPattern(false);
        } catch (error) {
            console.error(`Failed to reset ${rainMeterParam.name} to default:`, error);
        }
    };

    const handleAddField = () => {
        setAddingField(true);
        setNewFieldInput('');
    };

    const handleSaveNewField = async () => {
        if (newFieldInput.trim() && !fields.includes(newFieldInput.trim())) {
            const updatedFields = [...fields, newFieldInput.trim()];
            try {
                await setFieldsForParameter(rainMeterParam.configKey, updatedFields);
                setFields(updatedFields);
                setAddingField(false);
                setNewFieldInput('');
                console.log(`Successfully added field "${newFieldInput.trim()}" to ${rainMeterParam.name}`);
            } catch (error) {
                console.error(`Failed to add field to ${rainMeterParam.name}:`, error);
            }
        }
    };

    const handleCancelAddField = () => {
        setAddingField(false);
        setNewFieldInput('');
    };

    const handleRemoveField = async (indexToRemove: number) => {
        const updatedFields = fields.filter((_, index) => index !== indexToRemove);
        try {
            await setFieldsForParameter(rainMeterParam.configKey, updatedFields);
            setFields(updatedFields);
            console.log(`Successfully removed field from ${rainMeterParam.name}`);
        } catch (error) {
            console.error(`Failed to remove field from ${rainMeterParam.name}:`, error);
        }
    };

    return (
        <div className="mb-6 border p-4 rounded-lg">
            <div className='text-lg font-semibold mb-2 text-accent-foreground'>{rainMeterParam.name}</div>

            <div>
                <div className='flex text-xs text-muted-foreground gap-2 items-center'>
                    Pattern
                    <div className="flex gap-1 items-center">
                        {!editingPattern ? (
                            <button
                                className="text-accent-foreground hover:text-accent-foreground/80 bg-blue-500 hover:bg-blue-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105"
                                onClick={handleEditPattern}
                                title="Edit Pattern"
                            >
                                <FaPen />
                            </button>
                        ) : (
                            <>
                                <button
                                    className="text-white hover:text-white/80 bg-green-500 hover:bg-green-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105 animate-in slide-in-from-left-2 fade-in"
                                    onClick={handleSaveRegex}
                                    title="Save Changes"
                                >
                                    <FaRegSave />
                                </button>
                                <button
                                    className="text-white hover:text-white/80 bg-red-500 hover:bg-red-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105 animate-in slide-in-from-right-2 fade-in"
                                    onClick={handleDiscardChanges}
                                    title="Discard Changes"
                                >
                                    <FaTimes />
                                </button>
                            </>
                        )}
                        <button 
                            className="bg-gray-500 hover:bg-gray-700 text-white rounded px-1 py-1 transition-all duration-300 transform hover:scale-105"
                            onClick ={handleResetPatternToDefault}
                            title="Undo Changes"
                        >
                            <FaUndo />
                        </button>
                    </div>
                </div>

                <input
                    type="text"
                    name="pattern"
                    id="pattern"
                    className={`border rounded-md p-1 ${editingPattern ? 'bg-accent' : 'cursor-not-allowed'} w-full mt-1 mb-2 text-sm transition-all`}
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    disabled={!editingPattern}
                />
            </div>
            <div>
                <div className="flex text-xs text-muted-foreground gap-2 items-center">
                    Fields

                    <button 
                        className="rounded bg-blue-500 hover:bg-blue-700 text-white px-1 py-1 transition-all duration-300 transform hover:scale-105"
                        onClick={handleAddField}
                        title="Add Field"
                    >
                        <FaPlus />
                    </button>

                </div>

                {addingField && (
                    <div className='flex gap-2 items-center mt-2 animate-in slide-in-from-left-2 fade-in'>
                        <input
                            type="text"
                            placeholder="Enter field name"
                            value={newFieldInput}
                            onChange={(e) => setNewFieldInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSaveNewField();
                                } else if (e.key === 'Escape') {
                                    handleCancelAddField();
                                }
                            }}
                            className="border rounded-md p-1 text-sm transition-all focus:border-blue-500 flex-1"
                            autoFocus
                        />

                        <button 
                            className="text-white hover:text-white/80 bg-green-500 hover:bg-green-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105"
                            onClick={handleSaveNewField}
                            title="Save Field"
                        >
                            <FaRegSave />
                        </button>

                        <button 
                            className="text-white hover:text-white/80 bg-red-500 hover:bg-red-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105"
                            onClick={handleCancelAddField}
                            title="Cancel"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}   
                
                <div className='pt-1'>
                    {fields.map((field, index) => (
                        <div className="flex justify-between items-center px-1 gap-2" key={index}>
                            <div 
                                key={index} 
                                className="flex-1 border border-accent rounded-md p-2 mb-2 text-sm bg-foreground/10"
                            >
                                {field}
                            </div>
                            <button 
                                className="flex bg-red-500 hover:bg-red-700 rounded p-1 items-center"
                                onClick={() => handleRemoveField(index)}
                                title="Remove Field"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                    ))}        
                </div>
                
            </div>     
            
        </div>
    )
}

export default RainMeterSettings