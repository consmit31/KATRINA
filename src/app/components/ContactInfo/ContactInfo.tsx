import React, { useState, forwardRef, useImperativeHandle } from 'react'

import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setName, setUserId, setEmail, setPhone } from '@redux/contactInformationSlice';
import AddFieldButton from './AddFieldButton';
import ContactField from './ContactField';
import MiscContactField from './MiscContactField';

export interface ContactInfoRef {
  resetFields: () => void;
}

const ContactInfo = forwardRef<ContactInfoRef>((props, ref) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.contactInfo.userId);
  const name = useAppSelector(state => state.contactInfo.name);
  const phone = useAppSelector(state => state.contactInfo.phone);
  const email = useAppSelector(state => state.contactInfo.email);

  const [additionalFields, setAdditionalFields] = useState<{
    userId: string[];
    name: string[];
    phone: string[];
    email: string[];
    misc: string[];
  }>({
    userId: [],
    name: [],
    phone: [],
    email: [],
    misc: [''],
  });

  const resetFields = () => {
    dispatch(setUserId(''));
    setAdditionalFields({
      userId: [],
      name: [],
      phone: [],
      email: [],
      misc: ['']
    });
  };

  useImperativeHandle(ref, () => ({
    resetFields
  }));

  const addField = (fieldType: 'userId' | 'name' | 'phone' | 'email' | 'misc') => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldType]: [...prev[fieldType], '']
    }));
  };

  const updateAdditionalField = (fieldType: 'userId' | 'name' | 'phone' | 'email' | 'misc', index: number, value: string) => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldType]: prev[fieldType].map((field, i) => i === index ? value : field)
    }));
  };

  const removeField = (fieldType: 'userId' | 'name' | 'phone' | 'email' | 'misc', index: number) => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldType]: prev[fieldType].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid grid-cols-5 gap-4 mb-4 p-4 bg-accent/50 rounded-lg border border-accent/70 text-sm text-muted-foreground">
      <div className='flex flex-col space-y-2 min-w-0'>
        <div className='flex items-center space-x-2'>
          <label className='text-accent-foreground'>User ID</label>
          <AddFieldButton
            onAddField={() => addField('userId')}
            fieldType='User ID'
          />
        </div>
        <ContactField
          type="text"
          allowDelete={false}
          placeholder="User ID"
          value={userId}
          onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setUserId(e.target.value))}
        />
        {additionalFields.userId.map((value, index) => (
          <ContactField
            key={index}
            type="text"
            allowDelete={true}
            index={index}
            value={value}
            placeholder="User ID"
            onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAdditionalField('userId', index, e.target.value)}
            onRemoveField={() => removeField('userId', index)}
          />
        ))}
      </div>

      <div className='flex flex-col space-y-2 min-w-0'>
        <div className='flex items-center space-x-2'>
          <label className='text-accent-foreground'>Name</label>
          <AddFieldButton
            onAddField={() => addField('name')}
            fieldType='Name'
          />
        </div>
        <ContactField
          type="text"
          allowDelete={false}
          placeholder="Name"
          value={name}
          onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setName(e.target.value))}
        />
        {additionalFields.name.map((value, index) => (
          <ContactField
            type="text"
            key={index}
            allowDelete={true}
            index={index}
            value={value}
            placeholder="Name"
            onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAdditionalField('name', index, e.target.value)}
            onRemoveField={() => removeField('name', index)}
          />
        ))}
      </div>

      <div className='flex flex-col space-y-2 min-w-0'>
        <div className='flex items-center space-x-2'>
          <label className='text-accent-foreground'>Phone</label>
          <AddFieldButton
            onAddField={() => addField('phone')}
            fieldType='Phone'
          />
        </div>
        <ContactField
          type="tel"
          allowDelete={false}
          placeholder="Phone"
          value={phone}
          onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPhone(e.target.value))}
        />
        {additionalFields.phone.map((value, index) => (
          <ContactField
            type="tel"
            key={index}
            allowDelete={true}
            index={index}
            value={value}
            placeholder="Phone"
            onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAdditionalField('phone', index, e.target.value)}
            onRemoveField={() => removeField('phone', index)}
          />
        ))}
      </div>

      <div className='flex flex-col space-y-2 min-w-0'>
        <div className='flex items-center space-x-2'>
          <label className='text-accent-foreground'>Email</label>
          <AddFieldButton
            onAddField={() => addField('email')}
            fieldType='Email'
          />
        </div>
        <ContactField
          type="email"
          allowDelete={false}
          placeholder="Email"
          value={email}
          onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value))}
        />
        {additionalFields.email.map((value, index) => (
          <ContactField
            type="email"
            key={index}
            allowDelete={true}
            index={index}
            value={value}
            placeholder="Email"
            onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAdditionalField('email', index, e.target.value)}
            onRemoveField={() => removeField('email', index)}
          />
        ))}
      </div>

      <div className='flex flex-col space-y-2 min-w-0'>
        <div className='flex items-center space-x-2'>
          <label className='text-accent-foreground'>Misc</label>
          <AddFieldButton
            onAddField={() => addField('misc')}
            fieldType='Misc'
          />
        </div>
        {additionalFields.misc.map((value, index) => (
          <MiscContactField
            key={index}
            allowDelete={true}
            index={index}
            offsetIndexLabel={false}
            value={value}
            placeholder="Misc"
            onFieldChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAdditionalField('misc', index, e.target.value)}
            onRemoveField={() => removeField('misc', index)}
          />
        ))}
      </div>
    </div>
  )
});

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo