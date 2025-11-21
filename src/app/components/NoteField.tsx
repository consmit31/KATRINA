"use client"

import React from 'react'

function NoteField() {

    return (
        <div className='bg-white text-black m-3 p-3 w-1/2'>
            <label htmlFor="notes"></label>
            <textarea 
                className="w-full h-32 text-black"
                id="notes"
                defaultValue={""}
            >

            </textarea>
        </div>
    )
}

export default NoteField
