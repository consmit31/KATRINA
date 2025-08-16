"use client";

import React, { useEffect, useRef, useState } from 'react'
import { useFocusContext } from './FocusContext';
import Template from '../dataTypes/Template';

function TemplateForm()  {
  const {state, dispatch} = useFocusContext();

  const handleFieldChange = (fieldLabel: string, value: string) => {
    console.log(`Field Changed: ${fieldLabel} = ${value}`);
    dispatch({ type: "SET_TEMPLATE_FIELD_VALUE", fieldLabel, value });
  };

  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (state.selectedTemplate) {
      state.selectedTemplate.fields.forEach(field => {
        let defaultValue = "";
        if (field.type === "selector") {
          defaultValue = field.options![0];
        }
        dispatch({ type: "SET_TEMPLATE_FIELD_VALUE", fieldLabel: field.label, value: defaultValue });
      })
    }
  }, [state.selectedTemplate, dispatch]);

  useEffect(() => {
    if (state.focusedComponent === "TemplateForm" && state.focusedFieldIndex !== undefined) {
      const field = state.selectedTemplate?.fields[state.focusedFieldIndex];
      if (!field) return;
      if (field.type === "selector") {
        selectRefs.current[state.focusedFieldIndex]?.focus();
      } else if (field.type === "text" || field.type === "text-selector") {
        inputRefs.current[state.focusedFieldIndex]?.focus();
      }
    }
  }, [state.focusedComponent, state.focusedFieldIndex, state.selectedTemplate]);

  return (
    <div className='flex flex-col bg-white text-black m-3 p-3 w-1/2'>
      <div>
        {state.selectedTemplate?.fields.map((field, index) => {
          switch (field.type){
            case "selector":
              return (
                <span key={field.label} className={`flex flex-row mx-1 p-1 justify-between ${state.focusedFieldIndex === index ? "bg-gray-200" : ""}`}>
                  <label>{field.label}</label>
                  <select
                    value={field.options![0]}
                    onChange={(e) => handleFieldChange(field.label, e.target.value)}
                    ref={el => { selectRefs.current[index] = el; }}
                    tabIndex={state.focusedFieldIndex === index ? 0 : -1}
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
                  <span key={field.label} className={`flex flex-row my-1 p-1 justify-between ${state.focusedFieldIndex === index ? "bg-gray-200" : ""}`}>
                    <label>{field.label}</label>
                    <input 
                      type="text" 
                      
                      onChange={(e) => handleFieldChange(field.label, e.target.value)}
                      ref={el => { inputRefs.current[index] = el; }}
                      tabIndex={state.focusedFieldIndex === index ? 0 : -1}
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
