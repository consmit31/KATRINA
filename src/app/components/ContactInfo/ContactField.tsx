import React from 'react'

interface ContactFieldProps {
    allowDelete?: boolean;
    index?: number;
    value?: string;
    type: string;
    placeholder: string;
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveField?: (field: string, index?: number) => void;
}

const ContactField = ({ allowDelete, 
                        index, 
                        value, 
                        type,
                        placeholder,
                        onFieldChange, 
                        onRemoveField }: 
ContactFieldProps) => {
    return (
        <div className='flex space-x-1'>
            <input
                type={type}
                autoComplete='off'
                placeholder={`${placeholder} ${index !== undefined ? index + 2 : ''}`}
                value={value}
                onChange={(e) => onFieldChange(e)}
                className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1'
            />
            {/* only show remove button if allowDelete is true */}
            {allowDelete && (
                <button
                    onClick={() => onRemoveField && onRemoveField('userId', index)}
                    className='w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 text-xs transition-colors'
                    title='Remove field'
                >
                ×
                </button>
            )}
        </div>
    )
}

export default ContactField