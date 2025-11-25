"use client";

import React, { useEffect, useState } from 'react'
import Template from '@dataTypes/Template';

import useTemplateStorage from '@hooks/useTemplateStorage';

import { useAppSelector } from '@redux/hooks';
import { useAppDispatch } from '@redux/hooks';
import { selectActiveTemplateName, updateFieldValue, setTemplateFields } from '@redux/activeTemplateSlice';
import { selectActiveComponent } from '@redux/activeComponentSlice'

function TemplateForm()  {
  const activeTemplateName = useAppSelector(selectActiveTemplateName);
  const dispatch = useAppDispatch();
  const { getTemplate } = useTemplateStorage();
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  const activeComponent = useAppSelector(selectActiveComponent);

  const handleFieldChange = (label: string, value: string) => {
    if (!activeTemplate) return;

    const updatedFields = activeTemplate.fields.map(field => {
      if (field.label === label) {
        return { ...field, value };
      }
      return field;
    });

    dispatch(updateFieldValue({ label, value }));

    setActiveTemplate({ ...activeTemplate, fields: updatedFields });
  };

  useEffect(() => {
    if (activeTemplateName) {
      const fetchTemplate = async () => {
        const template = await getTemplate(activeTemplateName);
        if (template) {
          setActiveTemplate(template);
          dispatch(setTemplateFields(template.fields));
        }
      };
      fetchTemplate();
    }

    if (activeComponent !== "TemplateForm") {
      setActiveTemplate(null);
    }
  }, [activeTemplateName, getTemplate, activeComponent, dispatch]);

  return (
    <div className='flex flex-col bg-white text-black m-3 p-3 w-1/2'>
      <div>
        {activeTemplate?.fields.map((field) => {
          switch (field.type){
            case "selector":
              return (
                <span key={field.label} className={"flex flex-row mx-1 p-1 justify-between focus:bg-gray-200"}>
                  <label>{field.label}</label>
                  <select
                    value={field.value || field.options![0]}
                    onChange={(e) => {handleFieldChange(field.label, e.target.value)}}
                    >
                    {field.options!.map((option) => (
                      <option key={option} value={option}>
                        {option}  
                      </option>
                    ))}
                  </select>
                </span>
              )

              case "text":
                return (
                  <span key={field.label} className={"flex flex-row my-1 p-1 justify-between focus:bg-gray-200"}>
                    <label>{field.label}</label>
                    <input 
                      type="text" 
                      onChange={(e) => handleFieldChange(field.label, e.target.value)}
                      className='border border-gray-300 rounded mx-1' />
                  </span>
                );
          }
        })}
      </div>
    </div>
  )
}

export default TemplateForm
