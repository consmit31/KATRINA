"use client";

import { useEffect, useState } from "react";
import IssueSelector from "./components/IssueSelector"
import { FocusProvider } from "./components/FocusContext";
import TemplateForm from "./components/TemplateForm";
import NoteField from "./components/NoteField";
import NewTemplateModal from "./components/NewTemplateModal";

export default function Home() {
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);

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

  return (
    <FocusProvider>
      <div className="h-full">
        {showNewTemplateModal && <NewTemplateModal />}
        <IssueSelector/>
        <span className="flex flex-row w-full">
          <TemplateForm/>
          <NoteField/>
        </span>
      </div>
    </FocusProvider>
  );
}

