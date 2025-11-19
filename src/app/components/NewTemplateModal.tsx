import React from 'react'

const NewTemplateModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-90vw">
        <h2 className="text-xl font-semibold mb-4">New Template</h2>
        <p className="text-gray-600 mb-4">Create a new template</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewTemplateModal