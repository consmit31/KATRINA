import React from 'react'

function ShortcutsTooltips() {
    return (
        <div className="relative group">
            <p className="cursor-help">Shortcuts</p>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="text-left">
                    <div>Tab: Navigate between fields</div>
                    <div>Enter: Submit/Select</div>
                    <div>Ctrl+Y: Open New Template Modal</div>
                    <div>Ctrl+T: Open Tools Modal</div>
                    <div>Ctrl+R: Reset Selected Template</div>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
            </div>
        </div>
    )
}

export default ShortcutsTooltips
