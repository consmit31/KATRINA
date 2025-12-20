"use client"

import React, { useEffect } from 'react'
import { selectActiveTemplateName, selectTemplateFields } from '../../redux/activeTemplateSlice';
import { useAppSelector } from '@redux/hooks';
import { useTemplateStorage } from '@hooks/useTemplateStorage';
import { selectActiveComponent } from '@redux/activeComponentSlice';

function NoteField() {
    const activeTemplateName = useAppSelector(selectActiveTemplateName);
    const activeComponent = useAppSelector(selectActiveComponent);
    const templateFields = useAppSelector(selectTemplateFields);
    const { getExistingTemplate } = useTemplateStorage();

    useEffect(() => {
        if (activeTemplateName) {
            const fetchKba = async () => {
                const template = await getExistingTemplate(activeTemplateName);
                const kba = template?.kba;
                if (kba) {
                    appendToTextArea(kba);
                }
            };

            clearTextArea();
            fetchKba();
        }

        if (activeComponent === "IssueSelector") {
            clearTextArea();
        }

    }, [activeTemplateName, getExistingTemplate, activeComponent]);

    useEffect(() => {
        if (activeTemplateName) {
            const textArea = document.getElementById("notes") as HTMLTextAreaElement;
            let kbaContent = "";
            
            // Preserve existing KBA content if it exists
            if (textArea && textArea.value) {
                const lines = textArea.value.split("\n");
                const hasExistingKBA = lines.length > 0 && lines[0].trim().length > 0 && 
                                     (lines[0].startsWith("KBA") || !lines[0].includes(":"));
                if (hasExistingKBA) {
                    kbaContent = lines[0];
                }
            }
            
            clearTextArea();
            
            // Re-add KBA content first if it existed
            if (kbaContent) {
                appendToTextArea(kbaContent);
            }
            
            // Add template fields
            for (const field of templateFields || []) {
                if (field.value) {
                    appendToTextArea(`${field.label}: ${field.value}`);
                } else {
                    appendToTextArea(`${field.label}: `);
                }
            } 
        }
    }, [activeTemplateName, templateFields])

    const appendToTextArea = (text: string) => {
        const textArea = document.getElementById("notes") as HTMLTextAreaElement;
        if (textArea) {
            const currentContent = textArea.value;
            const lines = currentContent.split("\n");
            
            // Check if this is KBA content (usually doesn't contain ':' like template fields)
            const isKBAContent = text.startsWith("KBA") || !text.includes(":");
            
            // Check if first line already contains KBA content
            const hasExistingKBA = lines.length > 0 && lines[0].trim().length > 0 && 
                                 (lines[0].startsWith("KBA") || !lines[0].includes(":"));
            
            if (isKBAContent) {
                if (hasExistingKBA) {
                    // Replace existing KBA with new KBA content
                    lines[0] = text;
                    textArea.value = lines.join("\n");
                } else {
                    // Add KBA as first line
                    textArea.value = text + "\n" + currentContent;
                }
            } else {
                // For template fields (containing ':'), append to end
                textArea.value += text + "\n";
            }
        }
    };

    const clearTextArea = () => {
        const textArea = document.getElementById("notes") as HTMLTextAreaElement;
        if (textArea) {
            textArea.value = "";
        }
    };

    return (
        <div className='bg-card border rounded-xl shadow-lg flex-1 lg:flex-none lg:w-1/2 transition-all duration-300'>
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-card-foreground">Notes & Output</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => {
                                const textArea = document.getElementById("notes") as HTMLTextAreaElement;
                                if (textArea) {
                                    navigator.clipboard.writeText(textArea.value);
                                }
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-muted hover:bg-muted/80"
                            title="Copy to clipboard"
                        >
                            Copy
                        </button>
                        <button
                            onClick={clearTextArea}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-muted hover:bg-muted/80"
                            title="Clear notes"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <textarea
                        className="w-full h-full min-h-[300px] p-4 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none font-mono text-sm leading-relaxed"
                        id="notes"
                        placeholder={`Template output will appear here...`}
                        defaultValue={""}
                    />
                </div>
            </div>
        </div>
    )
}

export default NoteField
