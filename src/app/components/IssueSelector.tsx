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
                    {
                        name: "MiLogin: PW",
                        kba: "KBA123",
                        fields: [
                            { 
                                type: 'text',
                                label: "Username", 
                                allowCustom: true,
                            },
                            { 
                                type: 'selector',
                                label: "Password", 
                                options: ["password", "text", "email"],
                                allowCustom: false
                            },
                        ]
                    },
                    {
                        name: "MiLogin: Dupe. Acct",
                        kba: "KBA124",
                        fields: [
                            {
                                type: 'text',
                                label: "Username",
                                allowCustom: true,
                            },
                            {
                                type: 'selector',
                                label: "Password", options: ["password"], allowCustom: false }
                        ]
                    },
                    {
                        name: "MiLogin: Inac. Acct",
                        kba: "KBA125",
                        fields: [
                            {
                                type: 'text',
                                label: "Username",
                                allowCustom: true,
                            },
                            {
                                type: 'selector',
                                label: "Password", options: ["password"], allowCustom: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "Windows",
                templates: [
                    {
                        name: "Locked account",
                        kba: "KBA126",
                        fields: [
                            {
                                type: 'text',
                                label: "Username",
                                options: ["text"],
                                allowCustom: true
                            },
                            {
                                type: 'selector',
                                label: "Password",
                                options: ["password"],
                                allowCustom: false
                            }
                        ]
                    },
                    {
                        name: "Password reset",
                        kba: "KBA127",
                        fields: [
                            {
                                type: 'text',
                                label: "Username",
                                options: ["text"],
                                allowCustom: true
                            },
                            {
                                type: 'selector',
                                label: "Password",
                                options: ["password"],
                                allowCustom: false
                            }
                        ]
                    }
                ]
            }
        ];

    const { state, dispatch } = useFocusContext();

    

    if (state.focusedComponent === "IssueSelector") {
        return (
            <div
                className={`flex flex-col bg-white text-black m-3 p-3 ${state.focusedComponent === "IssueSelector" ? 'h-1/2' : 'h-min-content'}`}
                tabIndex={0}
            >
                {issues.map((issue, index) => (
                    <div className={`${state.focusedIssueIndex === index && state.openIssue === undefined ? 'bg-gray-300' : 'bg-transparent'}`} key={issue.name} >
                        <IssueDropdown issue={issue} index={index} />
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="flex flex-col bg-white text-black m-3 p-3 h-min-content" tabIndex={0}>
                <span>
                    {state.selectedTemplate?.name}: {state.selectedTemplate?.kba}
                </span>
            </div>
        );
    }
}

export default IssueSelector
