import React from 'react'
import ImportToolContent from './toolContent/ImportToolContent';
import ViewToolContent from './toolContent/ViewToolContent';
import ReportingToolContent from './toolContent/ReportingToolContent';

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-200">
          <span className="flex justify-between items-center">
              <h2 className="text-xl text-gray-600 font-semibold">Tools</h2>
              <button className="text-white bg-red-600 rounded px-2 py-1 hover:bg-red-700 transition-colors" onClick={onClose}>X</button>
          </span>
        </div>
        
        <div className="flex flex-row flex-1 overflow-hidden">
          {/* Tools Section */}
        <div className="flex flex-col justify-evenly p-6 pr-4 border-r border-gray-200 flex-shrink-0">
            <button
                onClick={() => handleToolClick('Import')}
                className={`px-4 py-2 rounded transition-colors ${
                    selectedTool === 'Import' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 border-2 border-blue-600' 
                }`}
            >
                Import Template Data
            </button>
            <button
                onClick={() => handleToolClick('Export')}
                className={`px-4 py-2 rounded transition-colors ${
                    selectedTool === 'Export' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 border-2 border-blue-600' 
                }`}
            >
                Export Template Data
            </button>
            <button
                onClick={() => handleToolClick('View All')}
                className={`px-4 py-2 rounded transition-colors ${
                    selectedTool === 'View All' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 border-2 border-blue-600'
                }`}
            >
                View All Template Data
            </button>
            <button
                onClick={() => handleToolClick('BR/FR')}
                className={`px-4 py-2 rounded transition-colors ${
                    selectedTool === 'BR/FR' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 border-2 border-blue-600'
                }`}
            >
                Bug Report & Feature Request
            </button>
        </div>

          {/* Content Area - scrollable tool-specific content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
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
                        return <ViewToolContent/>;
                    case "BR/FR":
                        return <ReportingToolContent/>; 
                }
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolsModal