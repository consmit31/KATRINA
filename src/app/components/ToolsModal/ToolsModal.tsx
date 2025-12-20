import React from 'react'
import { FaX } from 'react-icons/fa6'
import ImportToolContent from './toolContent/ImportToolContent';
import ViewToolContent from './toolContent/ViewToolContent';
import ReportingToolContent from './toolContent/ReportingToolContent';
import ExportToolContent from './toolContent/ExportToolContent';

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
    <div className='fixed inset-0 z-1 flex items-center justify-center bg-black/50'>
      <div className='bg-card rounded-lg w-full max-w-4xl h-[90vh] flex flex-col'>
        <div className='p-6 pb-4 border-b border-gray-200 '>
          <span className='flex justify-between items-center'>
              <span className='text-xl text-accent-foreground font-semibold'>Tools</span>
              <button
                  className='bg-red-600 rounded px-2 py-2 hover:bg-red-700 transition-colors'
                  onClick={onClose}
              >
                  <FaX />
              </button>
          </span>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="">
                <div className="flex">
                    <button
                        onClick={() => handleToolClick('Import')}
                        className={`px-6 py-2 text-sm bg-accent rounded-lg rounded-b-none border-accent-foreground font-medium transition-all duration-300 ease-in-out transform ${
                            selectedTool === 'Import' 
                                ? 'bg-blue-500 text-white shadow-md scale-105'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102'
                        }`}
                    >
                        Import
                    </button>
                    <button
                        onClick={() => handleToolClick('Export')}
                        className={`px-6 py-2 text-sm bg-accent rounded-lg rounded-b-none border-accent-foreground font-medium transition-all duration-300 ease-in-out transform ${
                            selectedTool === 'Export' 
                                ? 'bg-blue-500 text-white shadow-md scale-105'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102'
                        }`}
                    >
                        Export
                    </button>
                    <button
                        onClick={() => handleToolClick('View All')}
                        className={`px-6 py-2 text-sm bg-accent rounded-lg rounded-b-none border-accent-foreground font-medium transition-all duration-300 ease-in-out transform ${
                            selectedTool === 'View All' 
                                ? 'bg-blue-500 text-white shadow-md scale-105'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102'
                        }`}
                    >
                        View All
                    </button>
                    <button
                        onClick={() => handleToolClick('BR/FR')}
                        className={`px-6 py-2 text-sm bg-accent rounded-lg rounded-b-none border-accent-foreground font-medium transition-all duration-300 ease-in-out transform ${
                            selectedTool === 'BR/FR' 
                                ? 'bg-blue-500 text-white shadow-md scale-105'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102'
                        }`}
                    >
                        Bug Report
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-card p-4">
                {(() => {
                    switch (selectedTool) {
                        case "Import":
                            return <ImportToolContent/>; 
                        case "Export":
                            return <ExportToolContent/>; 
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