"use client";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

import IssueSelector from "./components/IssueSelector"
import TemplateForm from "./components/TemplateForm";
import NoteField from "./components/NoteField";
import NewTemplateModal from "./components/NewTemplateModal";

import { store } from "./redux/store";

import { useIssueStorage } from "./hooks/useIssueStorage";
import ToolsModal from "./components/ToolsModal";

function HomeContent() {
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const { refreshIssues } = useIssueStorage();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        setShowNewTemplateModal(prev => !prev);
      }

      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        setShowToolsModal(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-full">
      {showNewTemplateModal && (
        <NewTemplateModal 
          onClose={() => setShowNewTemplateModal(false)}
        />
      )}

      {showToolsModal && (
        <div>
          <ToolsModal
            onClose={() => setShowToolsModal(false)}
          />
        </div>
        )}
      <IssueSelector/>
      <span className="flex flex-row w-full">
        <TemplateForm/>
        <NoteField/>
      </span>
      <span>
        <button
          className="m-3 p-2 bg-blue-500 text-white rounded"
          onClick={() => {
            refreshIssues();
          }}
        >
          Tools
        </button>
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <Provider store={store}>
      <HomeContent />
    </Provider>
  );
}

