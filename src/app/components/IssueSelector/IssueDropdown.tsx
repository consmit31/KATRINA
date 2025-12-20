"use client"

import React from 'react'
import Issue from '@dataTypes/Issue'

import { useAppDispatch } from '@redux/hooks'

import { FaList, FaChartColumn} from 'react-icons/fa6'
import TemplateTile from './TemplateTile'
import { template } from '@babel/core'

interface IssueDropdownProps {
  issue: Issue;
}

function IssueDropdown({ issue }: IssueDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Focus first list item after state update
            setTimeout(() => {
                const firstListItem = document.querySelector(`ul li:first-child`) as HTMLElement;
                firstListItem?.focus();
            }, 0);
        }   
    }
    
    return (
        <div className='w-full'>
            <button 
                className='w-full p-3 text-left hover:bg-accent transition-colors duration-200 focus-ring rounded-lg group'
                onClick={handleButtonClick}
                aria-expanded={isOpen}
                aria-controls={`templates-${issue.name}`}
            >
                <div className='flex items-center justify-between'>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors"></div>
                        <h3 className='font-medium text-card-foreground group-hover:text-primary transition-colors'>
                            {issue.name}
                        </h3>
                        <div className='flex items-center space-x-1 bg-accent/50 px-2 py-1 rounded-full' title='Templates'>
                            <div className='text-xs'> <FaList /> </div>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {issue.templateNames.length}
                            </span> 
                        </div>
                        <div className='flex items-center space-x-1 bg-accent/50 px-2 py-1 rounded-full' title='Uses'>
                            <div className='text-xs'> <FaChartColumn /> </div>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"> 
                               {issue.metrics.usageCount} 
                            </span> 
                        </div>
                    </div>
                    <svg 
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'transform rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </button>
            
            {isOpen && (
                <div 
                    id={`templates-${issue.name}`}
                    className="ml-6 mt-2 space-y-1 animate-fadeIn"
                >
                    {issue.templateNames.map((templateName) => (
                        <TemplateTile key={templateName} templateName={templateName} issueName={issue.name}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default IssueDropdown
