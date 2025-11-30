import React, { useState } from 'react'

import { useAppDispatch } from '@redux/hooks';
import { setName, setUserId, setEmail, setPhone } from '@redux/contactInformationSlice';

const ContactInfo = () => {
  const dispatch = useAppDispatch();
  
  const [additionalFields, setAdditionalFields] = useState<{
    userId: string[];
    name: string[];
    phone: string[];
    email: string[];
  }>({
    userId: [],
    name: [],
    phone: [],
    email: []
  });

  const addField = (fieldType: 'userId' | 'name' | 'phone' | 'email') => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldType]: [...prev[fieldType], '']
    }));
  };

  const updateAdditionalField = (fieldType: 'userId' | 'name' | 'phone' | 'email', index: number, value: string) => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldType]: prev[fieldType].map((field, i) => i === index ? value : field)
    }));
  };

  const removeField = (fieldType: 'userId' | 'name' | 'phone' | 'email', index: number) => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldType]: prev[fieldType].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex space-x-4 mb-4 p-4 bg-accent/50 rounded-lg border border-accent/70 text-sm text-muted-foreground">
        <div className='flex flex-col space-y-2'>
            <div className='flex items-center space-x-2'>
              <label className='text-accent-foreground'>User ID</label>
              <button
                onClick={() => addField('userId')}
                className='w-5 h-5 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground text-xs font-bold transition-colors'
                title='Add another User ID field'
              >
                +
              </button>
            </div>
            <input 
              type="text"
              autoComplete='off'
              placeholder='User ID' 
              onChange={(e) => dispatch(setUserId(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
            {additionalFields.userId.map((value, index) => (
              <div key={index} className='flex space-x-1'>
                <input 
                  type="text"
                  autoComplete='off'
                  placeholder={`User ID ${index + 2}`}
                  value={value}
                  onChange={(e) => updateAdditionalField('userId', index, e.target.value)}
                  className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1' 
                />
                <button
                  onClick={() => removeField('userId', index)}
                  className='w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 text-xs transition-colors'
                  title='Remove field'
                >
                  ×
                </button>
              </div>
            ))}
        </div>

        <div className='flex flex-col space-y-2'>
            <div className='flex items-center space-x-2'>
              <label className='text-accent-foreground'>Name</label>
              <button
                onClick={() => addField('name')}
                className='w-5 h-5 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground text-xs font-bold transition-colors'
                title='Add another Name field'
              >
                +
              </button>
            </div>
            <input 
              type="text" 
              autoComplete='off' 
              placeholder='Name' 
              onChange={(e) => dispatch(setName(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
            {additionalFields.name.map((value, index) => (
              <div key={index} className='flex space-x-1'>
                <input 
                  type="text"
                  autoComplete='off'
                  placeholder={`Name ${index + 2}`}
                  value={value}
                  onChange={(e) => updateAdditionalField('name', index, e.target.value)}
                  className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1' 
                />
                <button
                  onClick={() => removeField('name', index)}
                  className='w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 text-xs transition-colors'
                  title='Remove field'
                >
                  ×
                </button>
              </div>
            ))}
        </div>

        <div className='flex flex-col space-y-2'>
            <div className='flex items-center space-x-2'>
              <label className='text-accent-foreground'>Phone</label>
              <button
                onClick={() => addField('phone')}
                className='w-5 h-5 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground text-xs font-bold transition-colors'
                title='Add another Phone field'
              >
                +
              </button>
            </div>
            <input 
              type="tel" 
              autoComplete='off' 
              placeholder='Phone' 
              onChange={(e) => dispatch(setPhone(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
            {additionalFields.phone.map((value, index) => (
              <div key={index} className='flex space-x-1'>
                <input 
                  type="tel"
                  autoComplete='off'
                  placeholder={`Phone ${index + 2}`}
                  value={value}
                  onChange={(e) => updateAdditionalField('phone', index, e.target.value)}
                  className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1' 
                />
                <button
                  onClick={() => removeField('phone', index)}
                  className='w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 text-xs transition-colors'
                  title='Remove field'
                >
                  ×
                </button>
              </div>
            ))}
        </div>

        <div className='flex flex-col space-y-2'>
            <div className='flex items-center space-x-2'>
              <label className='text-accent-foreground'>Email</label>
              <button
                onClick={() => addField('email')}
                className='w-5 h-5 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-accent-foreground text-xs font-bold transition-colors'
                title='Add another Email field'
              >
                +
              </button>
            </div>
            <input 
              type="email" 
              autoComplete='off' 
              placeholder='Email' 
              onChange={(e) => dispatch(setEmail(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
            {additionalFields.email.map((value, index) => (
              <div key={index} className='flex space-x-1'>
                <input 
                  type="email"
                  autoComplete='off'
                  placeholder={`Email ${index + 2}`}
                  value={value}
                  onChange={(e) => updateAdditionalField('email', index, e.target.value)}
                  className='border border-accent rounded-lg bg-foreground/10 px-2 py-1 flex-1' 
                />
                <button
                  onClick={() => removeField('email', index)}
                  className='w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 text-xs transition-colors'
                  title='Remove field'
                >
                  ×
                </button>
              </div>
            ))}
        </div>
        
    </div>
  )
}

export default ContactInfo