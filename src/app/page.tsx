"use client";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

import IssueSelector from "./components/IssueSelector"
import TemplateForm from "./components/TemplateForm";
import NoteField from "./components/NoteField";
import NewTemplateModal from "./components/NewTemplateModal";

import { store } from "./redux/store";

import Template from "./dataTypes/Template";
import { useIssueStorage } from "./hooks/useIssueStorage";

function HomeContent() {
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const { refreshIssues } = useIssueStorage();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        setShowNewTemplateModal(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseModal = () => {
    setShowNewTemplateModal(false);
  };

  const handleTemplateCreated = (template: Template) => {
    console.log('New template created:', template);
    // You could add logic here to refresh templates in your app state
  };

  return (
    <div className="h-full">
      {showNewTemplateModal && (
        <NewTemplateModal 
          onClose={handleCloseModal}
          onTemplateCreated={handleTemplateCreated}
        />
      )}
      <IssueSelector/>
      <span className="flex flex-row w-full">
        <TemplateForm/>
        <NoteField/>
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

