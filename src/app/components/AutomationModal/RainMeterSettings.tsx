import { RainMeterParameter } from '@/app/utils/indexedDB/RainMeterMatchStorage'
import React from 'react'
import { FaPen, FaRegSave, FaUndo, FaTimes } from 'react-icons/fa';

interface RainMeterSettingsProps {
    rainMeterParam: RainMeterParameter;
}

const RainMeterSettings = ({ rainMeterParam }: RainMeterSettingsProps) => {
    const [pattern, setPattern] = React.useState(rainMeterParam.pattern.source);
    const [originalPattern, setOriginalPattern] = React.useState(rainMeterParam.pattern.source);
    const [editingPattern, setEditingPattern] = React.useState(false);
    return (
        <div className="mb-6 border p-4 rounded-lg">
            <div className='text-lg font-semibold mb-2 text-accent-foreground'>{rainMeterParam.name}</div>
            
            <div className='flex text-xs text-muted-foreground gap-2 items-center'>
                Pattern
                <div className="flex gap-1 items-center">
                    {!editingPattern ? (
                        <button
                            className="text-accent-foreground hover:text-accent-foreground/80 bg-blue-500 hover:bg-blue-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105"
                            onClick={() => {
                                setOriginalPattern(pattern);
                                setEditingPattern(true);
                            }}
                            title="Edit Pattern"
                        >
                            <FaPen />
                        </button>
                    ) : (
                        <>
                            <button
                                className="text-white hover:text-white/80 bg-green-500 hover:bg-green-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105 animate-in slide-in-from-left-2 fade-in"
                                onClick={() => {
                                    setEditingPattern(false);
                                    // Here you could add logic to save the pattern to the database
                                }}
                                title="Save Changes"
                            >
                                <FaRegSave />
                            </button>
                            <button
                                className="text-white hover:text-white/80 bg-red-500 hover:bg-red-700 transition-all duration-300 rounded px-1 py-1 transform hover:scale-105 animate-in slide-in-from-right-2 fade-in"
                                onClick={() => {
                                    setPattern(originalPattern);
                                    setEditingPattern(false);
                                }}
                                title="Discard Changes"
                            >
                                <FaTimes />
                            </button>
                        </>
                    )}
                    <button className="bg-gray-500 hover:bg-gray-700 text-white rounded px-1 py-1 transition-all duration-300 transform hover:scale-105">
                        <FaUndo />
                    </button>
                </div>
            </div>
            
            <input 
            type="text" 
            name="pattern" 
            id="pattern" 
            className={`border rounded-md p-1 ${editingPattern ? 'bg-accent' : 'cursor-not-allowed' } w-full mt-1 mb-2 text-sm transition-all`} 
            value={pattern} 
            onChange={(e) => setPattern(e.target.value)}
            disabled={!editingPattern}
            />
        </div>
    )
}

export default RainMeterSettings