import React from 'react'
import ImportToolContent from './ImportToolContent';

interface ToolsModalProps {
  onClose?: () => void;
}

const ToolsModal = ({ onClose }: ToolsModalProps) => {
    const [selectedTool, setSelectedTool] = React.useState<"Import" | "Export" | "View All" | "BR/FR">("Import");
  
    const handleToolClick = (toolName: string) => {
        switch (toolName) {
            case 'Import':
                setSelectedTool("Import");
                break;
            case 'Export':
                setSelectedTool("Export");
                break;
            case 'View All':
                setSelectedTool("View All");
                break;
            case 'BR/FR':
                setSelectedTool("BR/FR");
                break;
        }
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-90vh overflow-y-auto">
        <span className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-600 font-semibold mb-4">Tools</h2>
            <button className="text-white bg-red-600 rounded px-2 py-1 hover:bg-red-700 transition-colors" onClick={onClose}>X</button>
        </span>
        
        
        <div className="flex flex-row">
          {/* Tools Section */}
        <div className="flex flex-col justify-evenly pr-6">
            <button
                onClick={() => handleToolClick('Import')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Import Template Data
            </button>
            <button
                onClick={() => handleToolClick('Export')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
                Export Template Data
            </button>
            <button
                onClick={() => handleToolClick('View All')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
                View All Template Data
            </button>
            <button
                onClick={() => handleToolClick('BR/FR')}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
                Bug Report & Feature Request
            </button>
        </div>

          {/* Content Area - placeholder for tool-specific content */}
          <div className="min-h-80 p-4 border border-gray-300 rounded-md bg-gray-50 w-full">
            {(() => {
                switch (selectedTool) {
                    case "Import":
                        return <ImportToolContent/>; 
                    case "Export":
                        return (
                            <div>
                                <h3 className="text-lg font-medium mb-3">Export Template Data</h3>
                                <p className="text-gray-600 mb-4">Export your template data to a file.</p>
                                Export tool content will go here
                            </div>
                        );
                    case "View All":
                        return (
                            <div>
                                <h3 className="text-lg font-medium mb-3">View All Template Data</h3>
                                <p className="text-gray-600 mb-4">View and manage all your template data.</p>
                                View all tool content will go here
                            </div>
                        );
                    case "BR/FR":
                        return (
                            <div>
                                <h3 className="text-lg font-medium mb-3">Bug Report & Feature Request</h3>
                                <p className="text-gray-600 mb-4">Report bugs or request new features.</p>
                                Bug report tool content will go here
                            </div>
                        );
                    default:
                        return (
                            <p className="text-gray-500 italic text-center">
                                Select a tool to see its options and functionality.
                            </p>
                        );
                }
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolsModal