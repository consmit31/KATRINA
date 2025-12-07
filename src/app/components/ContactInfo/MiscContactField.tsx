import React from 'react'

interface MiscContactFieldProps {
    allowDelete?: boolean;
    index?: number;
    offsetIndexLabel?: boolean;
    value?: string;
    placeholder: string;
    onFieldChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRemoveField?: () => void;
}

const MiscContactField = ({
    allowDelete, 
    index, 
    offsetIndexLabel = true,
    value, 
    placeholder,
    onFieldChange, 
    onRemoveField 
}: MiscContactFieldProps) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');

        
    } 

  return (
        <div className='flex space-x-1 min-w-0'>
            <textarea
                rows={1}
                autoComplete='off'
                placeholder={`${placeholder} ${index !== undefined ? (offsetIndexLabel ? index + 2 : '') : ''}`} // if offset index is provided, show index + 2 (to account for base field)
                value={value}
                onPaste={(e) => handlePaste(e)}
                onChange={(e) => onFieldChange && onFieldChange(e)} // If onFieldChange is not provided, do nothing
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
                className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1 min-w-0 resize-none overflow-hidden scrollbar-none'
            />
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

export default MiscContactField