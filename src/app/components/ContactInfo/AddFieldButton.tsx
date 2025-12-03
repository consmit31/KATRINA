import React from 'react'

interface AddFieldButtonProps {
    onAddField: () => void;
    fieldType: string;
}

const AddFieldButton = ({ onAddField, fieldType }: AddFieldButtonProps) => {
    return (
        <button
            tabIndex={-1}
            onClick={onAddField}
            className='w-5 h-5 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground text-xs font-bold transition-colors'
            title={`Add another ${fieldType} field`}
        >
            +
        </button>
    )
}

export default AddFieldButton