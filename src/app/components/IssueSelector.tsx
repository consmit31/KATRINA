"use client"

import React, { useEffect } from 'react'
import IssueDropdown from './IssueDropdown'

import { useAppSelector } from '@redux/hooks'
import { selectActiveTemplateName } from '@redux/activeTemplateSlice'
import { selectActiveComponent } from '@redux/activeComponentSlice'
import { selectIssueRefreshTrigger } from '@redux/dataRefreshSlice'
import useIssueStorage from '@hooks/useIssueStorage'


function IssueSelector() {
    const { issues, loading, error, refreshIssues } = useIssueStorage();

    const activeComponent = useAppSelector(selectActiveComponent);
    const activeTemplateName = useAppSelector(selectActiveTemplateName);
    const issueRefreshTrigger = useAppSelector(selectIssueRefreshTrigger);

    useEffect(() => {
        // Refresh issues when the refresh trigger changes (e.g., when a new template is created)
        if (issueRefreshTrigger > 0) {
            refreshIssues();
        }
    }, [issueRefreshTrigger, refreshIssues]);

    // Handle loading and error states
    if (loading) {
        return (
            <div className="flex flex-col bg-white text-black m-3 p-3 h-min-content">
                <span>Loading templates...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col bg-white text-black m-3 p-3 h-min-content">
                <span className="text-red-500">Error loading templates: {error}</span>
            </div>
        );
    }

    if (activeComponent === "IssueSelector") {
        return (
            <div
                className={`flex flex-col bg-white text-black m-3 p-3 ${activeComponent === "IssueSelector" ? 'h-1/2' : 'h-min-content'}`}
                tabIndex={-1}
            >
                {issues.map((issue) => (
                    <div className={"focus:bg-gray-300"} key={issue.name} >
                        <IssueDropdown issue={issue}/>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="flex flex-col bg-white text-black m-3 p-3 h-min-content" tabIndex={0}>
                <span>
                    {activeTemplateName}
                </span>
            </div>
        );
    }
}

export default IssueSelector
