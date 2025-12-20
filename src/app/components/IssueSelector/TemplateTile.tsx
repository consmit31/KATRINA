import React from 'react'
import { FaChartColumn } from 'react-icons/fa6'

import { useAppDispatch } from '@redux/hooks'
import { setActiveComponent } from '@redux/activeComponentSlice'
import { setActiveTemplate } from '@redux/activeTemplateSlice';
import { triggerIssueRefresh } from '@redux/dataRefreshSlice';
import { useTemplateStorage } from '@/app/hooks/useTemplateStorage';
import Template from '@/app/dataTypes/Template';
import useIssueStorage from '@/app/hooks/useIssueStorage';

interface TemplateTileProps {
    template: Template;
    issueName: string;
}

const TemplateTile = ({ template, issueName }: TemplateTileProps) => {
    const dispatch = useAppDispatch();
    const { incrementTemplateUsage } = useTemplateStorage();
    const { incrementIssueUsage } = useIssueStorage();


    const handleKeyDown = async (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            await handleTemplateClick();
        }
    }

    const handleTemplateClick = async () => {
        try {
            // Increment usage count when template is selected
            await incrementTemplateUsage(template.name);
            await incrementIssueUsage(issueName);
            
            // Trigger global issue refresh to update parent components immediately
            dispatch(triggerIssueRefresh());
        } catch (error) {
            console.error("Failed to increment usage:", error);
        }
        
        dispatch(setActiveTemplate(template.name));
        dispatch(setActiveComponent("TemplateForm"));
    }

    return (
        <div className="flex items-center group">
            <button
                className="flex-1 p-2 text-left text-sm text-muted-foreground hover:text-card-foreground hover:bg-accent/50 rounded-l-md transition-all duration-150 focus-ring cursor-pointer"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e)}
                onClick={handleTemplateClick}
            >
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                    <span>{template.name}</span>
                    <div className='flex items-center space-x-1 bg-accent/50 px-2 py-1 rounded-full' title='Uses'>
                        <div className='text-xs'> <FaChartColumn /> </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"> 
                            {template.metrics.usageCount}
                        </span>
                    </div>
                </div>
            </button>
        </div>
    )
}

export default TemplateTile