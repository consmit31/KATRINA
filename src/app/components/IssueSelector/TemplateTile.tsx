import React, { useCallback, useEffect, useState } from 'react'
import { FaChartColumn } from 'react-icons/fa6'

import { useAppDispatch } from '@redux/hooks'
import { setActiveComponent } from '@redux/activeComponentSlice'
import { setActiveTemplate } from '@redux/activeTemplateSlice';
import { triggerIssueRefresh } from '@redux/dataRefreshSlice';
import { useTemplateStorage } from '@/app/hooks/useTemplateStorage';
import TemplateMetric from '@/app/dataTypes/TemplateMetric';
import useIssueStorage from '@/app/hooks/useIssueStorage';

interface TemplateTileProps {
    templateName: string;
    issueName: string;
}

const TemplateTile = ({ templateName, issueName }: TemplateTileProps) => {
    const dispatch = useAppDispatch();
    const { getTemplateMetrics, incrementTemplateUsage } = useTemplateStorage();
    const { incrementIssueUsage } = useIssueStorage();
    const [metrics, setMetrics] = useState<TemplateMetric | null>(null);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

 const fetchMetrics = useCallback(async () => {
        try {
            setIsLoadingMetrics(true);
            const fetchedMetrics = await getTemplateMetrics(templateName);
            if (fetchedMetrics) {
                setMetrics(fetchedMetrics);
            }
        } catch (error) {
            console.error("Failed to fetch template metrics:", error);
        } finally {
            setIsLoadingMetrics(false);
        }
    }, [templateName, getTemplateMetrics]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);


    const handleKeyDown = async (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            await handleTemplateClick(event.currentTarget.textContent || "");
        }
    }

    const handleTemplateClick = async (templateName: string) => {
        try {
            // Increment usage count when template is selected
            await incrementTemplateUsage(templateName);
            await incrementIssueUsage(issueName);
            
            // Refresh local template metrics to show updated count
            await fetchMetrics();
            
            // Trigger global issue refresh to update parent components immediately
            dispatch(triggerIssueRefresh());
        } catch (error) {
            console.error("Failed to increment usage:", error);
        }
        
        dispatch(setActiveTemplate(templateName));
        dispatch(setActiveComponent("TemplateForm"));
    }

    return (
        <div className="flex items-center group">
            <button
                className="flex-1 p-2 text-left text-sm text-muted-foreground hover:text-card-foreground hover:bg-accent/50 rounded-l-md transition-all duration-150 focus-ring cursor-pointer"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e)}
                onClick={() => handleTemplateClick(templateName)}
            >
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                    <span>{templateName}</span>
                    <div className='flex items-center space-x-1 bg-accent/50 px-2 py-1 rounded-full' title='Uses'>
                        <div className='text-xs'> <FaChartColumn /> </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"> 
                            {isLoadingMetrics ? "..." : (metrics ? metrics.usageCount : "0")}
                        </span>
                    </div>
                </div>
            </button>
        </div>
    )
}

export default TemplateTile