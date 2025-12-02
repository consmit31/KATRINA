"use client"
import React, { useState } from 'react'
import ShortcutsModal from './ShortcutsModal'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'

function ShortcutsButton() {
    const [showModal, setShowModal] = useState(false)
    const { formatShortcut } = useKeyboardShortcuts()

    return (
        <>
            <div className="relative group">
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-muted cursor-pointer hover:bg-accent rounded-lg transition-colors focus-ring"
                    title="Configure keyboard shortcuts"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Shortcuts</span>
                </button>
                
                {/* Tooltip showing current shortcuts */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    <div className="text-left">
                        <div>Tab: Navigate between fields</div>
                        <div>Enter: Submit/Select</div>
                        <div>{formatShortcut('newTemplate')}: Open New Template Modal</div>
                        <div>{formatShortcut('toolsModal')}: Open Tools Modal</div>
                        <div>{formatShortcut('resetTemplate')}: Reset Selected Template</div>
                        <div className="text-xs text-gray-300 mt-2 pt-2 border-t border-gray-600">
                            Click to customize
                        </div>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                </div>
            </div>

            {/* Shortcuts Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <ShortcutsModal 
                        onClose={() => setShowModal(false)}
                    />
                </div>
            )}
        </>
    )
}

export default ShortcutsButton
