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
    

    return (
        <button 
            className='focus:bg-gray-400'
            onClick={handleButtonClick}
        >
            <span className='flex'>
            <h2 className='px-1'>{issue.name}</h2>
            <div>
                {isOpen ? "▼" : "▶"}
            </div>
            </span>
            {isOpen && (
            <ul>
                {issue.templateNames.map((templateName) => (
                <li 
                    key={templateName}
                    className={"mx-10 focus:bg-gray-200"} 
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e)}
                >
                    {templateName}
                </li>
                ))}
            </ul>
            )}
        </button>
    )
}

export default IssueDropdown
