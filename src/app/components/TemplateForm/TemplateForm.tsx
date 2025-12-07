"use client";

import React, { useEffect, useCallback} from 'react'

import useTemplateStorage from '@hooks/useTemplateStorage';

import { useAppSelector } from '@redux/hooks';
import { useAppDispatch } from '@redux/hooks';
import { selectActiveTemplateName, selectTemplateFields, updateFieldValue, setTemplateFields } from '@redux/activeTemplateSlice';
import { selectContactName, selectContactUserId, selectContactEmail, selectContactPhone } from '@redux/contactInformationSlice';
import { selectActiveComponent } from '@redux/activeComponentSlice'
import { userIdFieldToPopulate, nameFieldToPopulate, emailFieldToPopulate, phoneFieldToPopulate } from '@utils/populateFromContactInfo';

function TemplateForm()  {
  const activeTemplateName = useAppSelector(selectActiveTemplateName);
  const templateFields = useAppSelector(selectTemplateFields);
  const dispatch = useAppDispatch();
  const { getTemplate } = useTemplateStorage();
  
  const contactUserId = useAppSelector(selectContactUserId);
  const contactName = useAppSelector(selectContactName);
  const contactEmail = useAppSelector(selectContactEmail);
  const contactPhone = useAppSelector(selectContactPhone);



  const activeComponent = useAppSelector(selectActiveComponent);

  const handleFieldChange = useCallback((label: string, value: string) => {
    dispatch(updateFieldValue({ label, value }));
  }, [dispatch]);
   
  useEffect(() => {
    if (!templateFields || templateFields.length === 0 || !contactUserId) return;

    const populateField = async () => {
      try {
        const fieldToPopulate = await userIdFieldToPopulate(templateFields);
        if (fieldToPopulate) {
          // Only update if the current value is different to prevent loops
          const currentField = templateFields.find(f => f.label === fieldToPopulate);
          if (currentField && currentField.value !== contactUserId) {
            handleFieldChange(fieldToPopulate, contactUserId);
          }
        }
      } catch (error) {
        console.error('Failed to populate user ID field:', error);
      }
    };

    populateField();
  }, [templateFields, contactUserId, handleFieldChange]);

  useEffect(() => {
    if (!templateFields || templateFields.length === 0 || !contactName) return;

    const populateField = async () => {
      try {
        const fieldToPopulate = await nameFieldToPopulate(templateFields);
        if (fieldToPopulate) {
          // Only update if the current value is different to prevent loops
          const currentField = templateFields.find(f => f.label === fieldToPopulate);
          if (currentField && currentField.value !== contactName) {
            handleFieldChange(fieldToPopulate, contactName);
          }
        }
      } catch (error) {
        console.error('Failed to populate name field:', error);
      }
    };

    populateField();
  }, [templateFields, contactName, handleFieldChange]);

  useEffect(() => {
    if (!templateFields || templateFields.length === 0 || !contactEmail) return;

    const populateField = async () => {
      try {
        const fieldToPopulate = await emailFieldToPopulate(templateFields);
        if (fieldToPopulate) {
          // Only update if the current value is different to prevent loops
          const currentField = templateFields.find(f => f.label === fieldToPopulate);
          if (currentField && currentField.value !== contactEmail) {
            handleFieldChange(fieldToPopulate, contactEmail);
          }
        }
      } catch (error) {
        console.error('Failed to populate email field:', error);
      }
    };

    populateField();
  }, [templateFields, contactEmail, handleFieldChange]);

  useEffect(() => {
    if (!templateFields || templateFields.length === 0 || !contactPhone) return;

    const populateField = async () => {
      try {
        const fieldToPopulate = await phoneFieldToPopulate(templateFields);
        if (fieldToPopulate) {
          // Only update if the current value is different to prevent loops
          const currentField = templateFields.find(f => f.label === fieldToPopulate);
          if (currentField && currentField.value !== contactPhone) {
            handleFieldChange(fieldToPopulate, contactPhone);
          }
        }
      } catch (error) {
        console.error('Failed to populate phone field:', error);
      }
    };

    populateField();
  }, [templateFields, contactPhone, handleFieldChange]);

  useEffect(() => {
    if (activeTemplateName && activeComponent === "TemplateForm") {
      const fetchTemplate = async () => {
        const template = await getTemplate(activeTemplateName);
        if (template) {
          dispatch(setTemplateFields(template.fields));
        }
      };
      fetchTemplate();
    }
  }, [activeTemplateName, getTemplate, activeComponent, dispatch]);

  return (
    <div className='bg-card border rounded-xl shadow-lg flex-1 lg:flex-none lg:w-1/2 transition-all duration-300'>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Template Configuration</h2>
          {activeTemplateName && (
            <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              {activeTemplateName}
            </div>
          )}
        </div>
        
        {!templateFields || templateFields.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm">Select a template to configure</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {templateFields.map((field) => {
              switch (field.type){
                case "selector":
                  return (
                    <div key={field.label} className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">
                        {field.label}
                      </label>
                      <select
                        value={field.value || field.options![0]}
                        onChange={(e) => {handleFieldChange(field.label, e.target.value)}}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                        >
                        {field.options!.map((option) => (
                          <option key={option} value={option}>
                            {option}  
                          </option>
                        ))}
                      </select>
                    </div>
                  )

                  case "text":
                    return (
                      <div key={field.label} className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">
                          {field.label}
                        </label>
                        <input 
                          type="text" 
                          value={field.value || ''}
                          onChange={(e) => handleFieldChange(field.label, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                        />
                      </div>
                    );
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateForm
