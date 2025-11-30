import React from 'react'

import { useAppDispatch } from '@redux/hooks';
import { setName, setUserId, setEmail, setPhone } from '@redux/contactInformationSlice';

const ContactInfo = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex space-x-4 mb-4 p-4 bg-accent/50 rounded-lg border border-accent/70 text-sm text-muted-foreground">
        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>User ID</label>
            <input 
              type="text"
              autoComplete='off'
              placeholder='User ID' 
              onChange={(e) => dispatch(setUserId(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>Name</label>
            <input 
              type="text" 
              autoComplete='off' 
              placeholder='Name' 
              onChange={(e) => dispatch(setName(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>Phone</label>
            <input 
              type="tel" 
              autoComplete='off' 
              placeholder='Phone' 
              onChange={(e) => dispatch(setPhone(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>Email</label>
            <input 
              type="email" 
              autoComplete='off' 
              placeholder='Email' 
              onChange={(e) => dispatch(setEmail(e.target.value))}
              className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' 
            />
        </div>
        
    </div>
  )
}

export default ContactInfo