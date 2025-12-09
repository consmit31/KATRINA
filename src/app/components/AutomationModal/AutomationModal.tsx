import React, { useEffect, useState } from 'react'
import { CustomFieldLabelsConfig, getCustomFieldLabelsConfig } from '@utils/indexedDB/CustomFieldLabelsStorage'
import { getRainMeterMatchConfig, RainMeterMatchConfig } from '@/app/utils/indexedDB/RainMeterMatchStorage';
import { FaX } from 'react-icons/fa6'
import ContactFieldTabContent from './ContactFieldTabContent';
import PCInfoFieldTabContent from './PCInfoFieldTabContent';

interface AutomationModalProps {
    onClose: () => void;
}

export interface TabConfig {
    type: string;
    title: string;
}

const AutomationModal = ({ onClose }: AutomationModalProps) => {    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabConfig>({ type: 'userIdLabels', title: 'User ID' });
    const [fieldLabelsConfig, setFieldLabelsConfig] = useState<CustomFieldLabelsConfig | null>(null);
    const [rainMeterConfig, setRainMeterConfig] = useState<RainMeterMatchConfig | null>(null);

    const tabs: TabConfig[] = [
        { type: 'userIdLabels', title: 'User ID' },
        { type: 'nameLabels', title: 'Name' },
        { type: 'emailLabels', title: 'Email' },
        { type: 'phoneLabels', title: 'Phone' },
        { type: 'pcInfo', title: 'PC Info' }
    ];

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const loadedFieldLabelsConfig = await getCustomFieldLabelsConfig();
            const loadedRainMeterConfig =  await getRainMeterMatchConfig();

            setFieldLabelsConfig(loadedFieldLabelsConfig);
            setRainMeterConfig(loadedRainMeterConfig);
        } catch (error) {
            console.error('Failed to load configuration:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!fieldLabelsConfig || !rainMeterConfig) {
        return null;
    }

    return (
        <div className='fixed inset-0 z-1 flex items-center justify-center bg-black/50'>
            <div className='bg-card rounded-lg w-full max-w-4xl h-[90vh] flex flex-col'>
                {/* Title */}
                <div className='p-6 pb-4 border-b border-gray-200 '>
                    <span className='flex justify-between items-center'>
                        <span className='text-xl text-accent-foreground font-semibold'>Automation Configuration</span>
                        <button
                            className='bg-red-600 rounded px-2 py-2 hover:bg-red-700 transition-colors'
                            onClick={onClose}
                        >
                            <FaX />
                        </button>
                    </span>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-accent-foreground">Loading configuration...</div>
                        </div>
                    ) : (
                        <>
                                <div className="">
                                    <div className="flex">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.type}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-6 py-2 text-sm bg-accent rounded-lg rounded-b-none border-accent-foreground font-medium transition-all duration-300 ease-in-out transform ${activeTab.type === tab.type
                                                        ? 'bg-blue-500 text-white shadow-md scale-105'
                                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102'
                                                    }`}
                                            >
                                                {tab.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            
                                {/* If activeTab is a Contact infoTab */}
                                {activeTab.type !== 'pcInfo' ? (
                                    <ContactFieldTabContent 
                                        tabConfig={activeTab}
                                        activeFieldConfig={fieldLabelsConfig[activeTab.type as keyof CustomFieldLabelsConfig] as string[]} 
                                        onConfigChange={loadConfig}
                                    /> 
                                ) : activeTab.type === 'pcInfo' ? (
                                    <PCInfoFieldTabContent
                                        rainmeterConfig={rainMeterConfig}
                                    /> 
                                ) : null}
                            
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AutomationModal