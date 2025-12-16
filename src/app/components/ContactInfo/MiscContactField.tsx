import React, { useState } from 'react'

interface MiscContactFieldProps {
    allowDelete?: boolean;
    index?: number;
    offsetIndexLabel?: boolean;
    value?: string;
    placeholder: string;
    onFieldChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onRemoveField?: () => void;
}

const MiscContactField = ({
    allowDelete,
    index,
    offsetIndexLabel = true,
    value,
    placeholder,
    onFieldChange,
    onPaste,
    onRemoveField
}: MiscContactFieldProps) => {
    const [showCopyButton, setShowCopyButton] = useState(false);

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pastedContent = e.clipboardData.getData('Text');
        onPaste(e);
        console.log('Paste event in MiscContactField - processing RainMeter patterns for:', pastedContent.split('\n').length, 'lines');
    };

    const handleCopyToClipboard = async () => {
        if (value) {
            try {
                await navigator.clipboard.writeText(value);
            } catch (err) {
                console.error('Failed to copy to clipboard:', err);
            }
        }
    };

    return (


        <div className='flex space-x-1 min-w-0'>
            <div 
                className='relative flex border border-accent rounded-lg bg-foreground/10 py-1 flex-1 min-w-0'
                onMouseEnter={() => setShowCopyButton(true)}
                onMouseLeave={() => setShowCopyButton(false)}
            >
                <textarea
                    rows={1}
                    autoComplete='off'
                    placeholder={`${placeholder} ${index !== undefined ? (offsetIndexLabel ? index + 2 : '') : ''}`} // if offset index is provided, show index + 2 (to account for base field)
                    value={value}
                    onPaste={handlePaste} // If onPaste is not provided, do nothing
                    onChange={(e) => {
                        if (onFieldChange) onFieldChange(e);
                        // Auto-resize the textarea after content change
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    className='flex-1 px-2 pr-8 resize-none overflow-hidden scrollbar-none bg-transparent border-none outline-none'
                />
                {/* Copy to clipboard button */}
                {showCopyButton && value && (
                    <button
                        onClick={handleCopyToClipboard}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-lg bg-background/80 hover:bg-background flex items-center justify-center text-foreground/60 hover:text-foreground transition-all duration-200 backdrop-blur-sm border border-accent/20'
                        title='Copy to clipboard'
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                )}
            </div>
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