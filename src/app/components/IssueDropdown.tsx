"use client"

import React from 'react'
import Issue from '../dataTypes/Issue'

import { useAppDispatch } from '@redux/hooks'
import { setActiveComponent } from '@redux/activeComponentSlice'
import { setActiveTemplate } from '@redux/activeTemplateSlice';

function IssueDropdown({ issue  }: { issue: Issue }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dispatch = useAppDispatch();

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
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            dispatch(setActiveTemplate(event.currentTarget.textContent || ""));
            dispatch(setActiveComponent("TemplateForm"));
        }
    }
    
    const handleTemplateClick = (templateName: string) => {
        dispatch(setActiveTemplate(templateName));
        dispatch(setActiveComponent("TemplateForm"));
        setIsOpen(false);
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
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {issue.templateNames.length}
                        </span>
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
                        <button
                            key={templateName}
                            className="w-full p-2 text-left text-sm text-muted-foreground hover:text-card-foreground hover:bg-accent/50 rounded-md transition-all duration-150 focus-ring cursor-pointer"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onClick={() => handleTemplateClick(templateName)}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                                <span>{templateName}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default IssueDropdown
