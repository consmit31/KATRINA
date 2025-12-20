"use client"

import React, { useEffect } from 'react'
import {FaCopy} from 'react-icons/fa6'

import IssueDropdown from './IssueDropdown'

import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { selectActiveTemplateName } from '@redux/activeTemplateSlice'
import { selectActiveComponent } from '@redux/activeComponentSlice'
import { selectIssueRefreshTrigger } from '@redux/dataRefreshSlice'
import { openNewTemplateModal } from '@redux/modalSlice'
import useIssueStorage from '@hooks/useIssueStorage'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'

function IssueSelector() {
    const { issues, loading, error, refreshIssues } = useIssueStorage();
    const { formatShortcut } = useKeyboardShortcuts();
    const dispatch = useAppDispatch();

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
            <div className="bg-card border rounded-xl p-6 shadow-md animate-pulse">
                <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-primary/20 rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">Loading templates...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-card border border-red-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-medium">Error loading templates: {error}</span>
                </div>
            </div>
        );
    }

    if (activeComponent === "IssueSelector") {
        return (
            <div
                className={`bg-card border rounded-xl shadow-lg transition-all duration-300 ${activeComponent === "IssueSelector" ? 'min-h-[400px]' : 'min-h-fit'}`}
                tabIndex={-1}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-card-foreground">Available Templates</h2>
                            <button 
                                className='text-primary cursor-pointer hover:text-primary/80 transition-colors'
                                onClick={() => dispatch(openNewTemplateModal({}))}
                                title={`Add new template (${formatShortcut('newTemplateModal')})`}
                            >
                                <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            
                        </div>

                        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {issues.length} templates
                        </div>
                    </div>

                    <div tabIndex={-1} className="space-y-2 max-h-80 overflow-y-auto scrollbar">
                        {issues.sort((a, b) => b.metrics.usageCount - a.metrics.usageCount).map((issue) => (
                            <div key={issue.name} className="border border-border/50 rounded-lg hover:border-border transition-colors">
                                <IssueDropdown issue={issue} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-card border rounded-xl p-4 shadow-md" tabIndex={0}>
                <div className="flex items-center justify-between space-x-3">
                    <span className='flex items-center space-x-2'>
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="font-medium text-card-foreground">
                            {activeTemplateName}
                        </span>
                    </span>
                    
                    <button
                        className='text-primary cursor-pointer hover:text-primary/80 transition-colors'
                        onClick={() => {
                            navigator.clipboard.writeText(activeTemplateName || '');
                        }}
                        title="Copy template name to clipboard"
                    >
                            <FaCopy />
                    </button>
                </div>
            </div>
        );
    }
}

export default IssueSelector
