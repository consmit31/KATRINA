"use client"

import React, { useEffect } from 'react'
import Issue from '../dataTypes/Issue'
import { useFocusContext } from './FocusContext'

function IssueDropdown({ issue, index }: { issue: Issue, index: number }) {
    const { state, dispatch } = useFocusContext();

    const [isOpen, setIsOpen] = React.useState(false);
    const [isHighlighted, setIsHighlighted] = React.useState(false);
    
    useEffect(() => {
        console.log(`state.openIssue: ${state.openIssue}`);
        console.log(`issue: ${issue.name}`);
        if (state.openIssue && state.openIssue.name === issue.name) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [state.openIssue, issue.name]);


    return (
        <div>
            <span className='flex'>
                <h2 className='px-1'>{issue.name}</h2>
                <button>
                    {isOpen ? "▼" : "▶"}
                </button>
            </span>
            {isOpen && (
                <ul>
                    {issue.templates.map((template, index) => (
                        <li key={template.name} className={`mx-10 ${state.focusedTemplateIndex === index ? "bg-gray-200" : ""}`}>
                            {template.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default IssueDropdown
