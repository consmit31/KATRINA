"use client"

import React, { useEffect } from 'react'
import Issue from '../dataTypes/Issue'
import IssueDropdown from './IssueDropdown'
import { useFocusContext } from './FocusContext'

function IssueSelector() {
    const issues: Issue[] = [
            {
                name: "Mi.gov",
                templates: [
                    {name: "MiLogin: PW", content: ""},
                    {name: "MiLogin: Dupe. Acct", content: ""},
                    {name: "MiLogin: Inac. Acct", content: ""}
                ]
            },
            {
                name: "Windows",
                templates: [
                    {name: "Locked account", content: ""},
                    {name: "Password reset", content: ""}
                ]
            }
        ]

    const { state, dispatch } = useFocusContext();

    return (
    <div 
        className='flex flex-col bg-white text-black m-3 p-3 h-1/2'
        tabIndex={0}
    >
        {issues.map((issue, index) => (
            <div className={`${state.focusedIssueIndex === index && state.openIssue === undefined ? 'bg-gray-300' : 'bg-transparent'}`} key={issue.name} >
                <IssueDropdown issue={issue} index={index} />
            </div>
        ))}
    </div>
  )
}

export default IssueSelector
