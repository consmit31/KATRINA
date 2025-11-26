"use client"

import React, { useEffect } from 'react'
import { selectActiveTemplateName, selectTemplateFields } from '../redux/activeTemplateSlice';
import { useAppSelector } from '../redux/hooks';
import { useTemplateStorage } from '../hooks/useTemplateStorage';
import { selectActiveComponent } from '../redux/activeComponentSlice';

function NoteField() {
    const activeTemplateName = useAppSelector(selectActiveTemplateName);
    const activeComponent = useAppSelector(selectActiveComponent);
    const templateFields = useAppSelector(selectTemplateFields);
    const { getKbaByName } = useTemplateStorage();
    
    useEffect(() => {
    if (activeTemplateName) {
      const fetchKba = async () => {
        clearTextArea();
        const kba = await getKbaByName(activeTemplateName);
        if (kba) {
            appendToTextArea(kba);
        }

        for (const field of templateFields || []){
        if (field.value) {
            appendToTextArea(`${field.label}: ${field.value}`);
        } else {
            appendToTextArea(`${field.label}: `);
        }
    }
      };
      fetchKba();
    } 

    if (activeComponent === "IssueSelector" ) {
        clearTextArea();
    }

  }, [activeTemplateName, getKbaByName, templateFields, activeComponent]);

    const appendToTextArea = (text: string) => {
        const textArea = document.getElementById("notes") as HTMLTextAreaElement;
        if (textArea) {
            textArea.value += text + "\n";
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
                        placeholder="Template output will appear here...\n\nYou can also add your own notes and modifications."
                        defaultValue={""}
                    />
                </div>
            </div>
        </div>
    )
}

export default NoteField
