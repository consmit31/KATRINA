import React from 'react'
import { FaWandMagicSparkles } from 'react-icons/fa6'

import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
// import { useAppDispatch } from '@redux/hooks'
// import { toggleAutomationModal } from '@redux/modalSlice'

const AutomationButton = () => {
    const { formatShortcut } = useKeyboardShortcuts()

  return (
    <div className="flex items-center text-xs ">
      <div className='flex flex-col items-center'>
        <button
            className='flex items-center space-x-2 px-3 py-2 text-sm bg-muted cursor-pointer hover:bg-accent rounded-lg transition-colors focus-ring h-10'
            title={`Open Automation (${formatShortcut('automationModal')})`}
            // onClick={() => dispatch(toggleAutomationModal())} 
        >
                <FaWandMagicSparkles />
            <span className='text-sm'>
                Automation
            </span>
        </button>
      </div>
    </div>
  )
}

export default AutomationButton