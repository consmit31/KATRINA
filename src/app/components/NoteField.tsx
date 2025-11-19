"use client"

import React from 'react'
import { useFocusContext } from './FocusContext'

function NoteField() {
    const { state } = useFocusContext();

    return (
        <div className='bg-white text-black m-3 p-3 w-1/2'>
            <label htmlFor="notes"></label>
            <textarea 
                className="w-full h-32 text-black"
                id="notes"
                defaultValue={state.compiledTemplateText ?? ""}
            >

            </textarea>
        </div>
    )
}

export default NoteField
