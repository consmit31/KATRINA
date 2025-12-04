import React from 'react'

interface ContactFieldProps {
    allowDelete?: boolean;
    index?: number;
    offsetIndexLabel?: boolean;
    value?: string;
    type: string;
    placeholder: string;
    onFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveField?: () => void;
}

const ContactField = ({ allowDelete, 
                        index, 
                        offsetIndexLabel = true,
                        value, 
                        type,
                        placeholder,
                        onFieldChange, 
                        onRemoveField }: 
ContactFieldProps) => {
    return (
        <div className='flex space-x-1 min-w-0'>
            <input
                type={type}
                autoComplete='off'
                placeholder={`${placeholder} ${index !== undefined ? (offsetIndexLabel ? index + 2 : '') : ''}`} // if offset index is provided, show index + 2 (to account for base field)
                value={value}
                onChange={(e) => onFieldChange && onFieldChange(e)} // If onFieldChange is not provided, do nothing
                className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1 min-w-0'
            />
            {/* only show remove button if allowDelete is true */}
            {allowDelete && (
                <button
                    onClick={() => onRemoveField && onRemoveField()}
                    className='w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 text-xs transition-colors flex-shrink-0'
                    title='Remove field'
                >
                ×
                </button>
            )}
        </div>
    )
}

export default ContactField