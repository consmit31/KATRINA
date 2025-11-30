import React from 'react'

const ContactInfo = () => {
  return (
    <div className="flex space-x-4 mb-4 p-4 bg-accent/50 rounded-lg border border-accent/70 text-sm text-muted-foreground">
        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>User ID</label>
            <input type="text" autoComplete='off' placeholder='User ID' className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' />
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>Name</label>
            <input type="text" autoComplete='off' placeholder='Name' className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' />
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-accent-foreground'>Contact</label>
            <input type="tel" autoComplete='off' placeholder='Contact' className='border border-accent rounded-lg bg-foreground/10 px-2 py-1' />
        </div>
        
    </div>
  )
}

export default ContactInfo