import { useCallback } from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTemplateFields, updateFieldValue } from '@redux/activeTemplateSlice';
import { useAppDispatch } from '@redux/hooks';
import { handleMiscContentPaste } from '@utils/populateFromMisc';

/**
 * Custom hook for handling RainMeter pattern matching and template field population
 */
export const useRainMeterPaste = () => {
  const dispatch = useAppDispatch();
  const templateFields = useAppSelector(selectTemplateFields);

  const handleFieldChange = useCallback((label: string, value: string) => {
    dispatch(updateFieldValue({ label, value }));
  }, [dispatch]);

  const processRainMeterPaste = useCallback(async (pastedContent: string) => {
    if (!templateFields || templateFields.length === 0) {
      console.log('No template fields available for RainMeter matching');
      return [];
    }

    try {
      const updates = await handleMiscContentPaste(pastedContent, templateFields, handleFieldChange);
      if (updates.length > 0) {
        console.log('Successfully populated fields from RainMeter patterns:', 
          updates.map(u => `${u.fieldLabel}: ${u.value} (${u.parameterName})`)
        );
      }
      return updates;
    } catch (error) {
      console.error('Failed to process RainMeter paste:', error);
      return [];
    }
  }, [templateFields, handleFieldChange]);

  return {
    processRainMeterPaste,
    hasTemplateFields: templateFields && templateFields.length > 0
  };
};