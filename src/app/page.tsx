"use client";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

import IssueSelector from "./components/IssueSelector"
import TemplateForm from "./components/TemplateForm";
import NoteField from "./components/NoteField";
import NewTemplateModal from "./components/NewTemplateModal";

import { store } from "./redux/store";
import { useAppDispatch } from '@redux/hooks'
import { setActiveComponent } from '@redux/activeComponentSlice'
import { resetActiveTemplate } from '@redux/activeTemplateSlice';

import ToolsModal from "./components/ToolsModal";

function HomeContent() {
  const dispatch = useAppDispatch();

  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show New Template Modal on Ctrl+Y
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        setShowNewTemplateModal(prev => !prev);
      }

      // Show Tools Modal on Ctrl+T
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        setShowToolsModal(prev => !prev);
      }

      // Reset selected template on Ctrl+R
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        dispatch(resetActiveTemplate());
        dispatch(setActiveComponent("IssueSelector"));
      }

    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

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

