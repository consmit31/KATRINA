"use client"
import React from 'react'
// import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
import { useAppDispatch } from '@redux/hooks'
import { toggleToolsModal } from '@redux/modalSlice'

function ToolsShortcut() {
  // const { formatShortcut } = useKeyboardShortcuts()
  const dispatch = useAppDispatch()

  return (
    <div className="flex items-center text-xs ">
      <div className='flex flex-col items-center'>
        <button
            className='flex items-center space-x-2 px-3 py-2 text-sm bg-muted cursor-pointer hover:bg-accent rounded-lg transition-colors focus-ring h-10'
            title='Open Tools Modal'
            onClick={() => dispatch(toggleToolsModal())} 
        >
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span className='text-sm'>
                Tools
            </span>
        </button>
      </div>
    </div>
  )
}

export default ToolsShortcut