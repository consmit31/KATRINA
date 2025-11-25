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
        <div className='bg-white text-black m-3 p-3 w-1/2'>
            <label htmlFor="notes"></label>
            <textarea 
                className="w-full h-full flex text-black"
                id="notes"
                defaultValue={""}
            >

            </textarea>
        </div>
    )
}

export default NoteField
